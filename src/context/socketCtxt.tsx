/*
Txt Me - A web based messaging platform
Copyright (C) 2025 Ryan Large

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

/// <reference types="vite/client" />

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import io, { Socket } from "socket.io-client";

import UserCtxt from "../context/userCtxt";
import useLogger from "../hooks/useLogger";
import useNotifActions from "../hooks/useNotifActions";
import { AppData } from "../types/configCtxtTypes";
import {
  MessageDeliveryErrorType,
  MessageUpdateType,
  SocketProps,
} from "../types/socketTypes";
import { Contacts, Message } from "../types/userTypes";
import { defaultMessage } from "../utils/constants";
import { urlBase64ToUint8Array } from "../utils/helpers";
import { useConfig } from "./configContext";
import { useDatabase } from "./dbContext";

export const SocketContext = createContext({} as SocketProps);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    IDB_GetPhoneNumber,
    IDB_AddMessage,
    IDB_UpdateMessage,
    IDB_UpdateAppDataWebPush,
    IDB_UpdateMessages,
  } = useDatabase();
  const { allMessages, contacts, setAllMessages } = useContext(UserCtxt);
  const { getAppData, setAppData } = useConfig();
  const { addSuccessNotif } = useNotifActions();

  /*
    TODO:
      IMPLEMENT:
        1. Add a reusable method for sending a new subscription to the server
  */

  const log = useLogger();

  // UseRef for socket to avoid unwanted rerenders
  const socketRef = useRef<Socket | null>(null);
  // Freshers allMessages data made available for M_HandleTextMessage
  const allMessagesRef = useRef(allMessages);

  // useEffects -----------------------------------------------------
  useEffect(() => {
    log.logAll("Inside useEffect for socket");
    M_QueryPhoneNumber();

    // Remove socket and disconnect
    return () => {
      if (socketRef.current) {
        log.devLog("Socket reference disconnecting");
        socketRef.current.disconnect();
      }
    };
  }, [socketRef]);

  // Make sure we always have the freshest allMessages data from UserCtxt inside of the attached socket listener M_HandleTextMessage
  useEffect(() => {
    allMessagesRef.current = allMessages;
  }, [allMessages]);
  // useEffects -------------------------------------------------------

  // Local Scop Context Methods ---------------------------------------
  const M_QueryPhoneNumber = async () => {
    const phoneNumber = await IDB_GetPhoneNumber();
    const webPushSubscription = getAppData("webPushSubscription") || {
      subscribed: false,
      subscription: null,
    };

    try {
      if (phoneNumber && socketRef) {
        M_SetUpSocket(phoneNumber, webPushSubscription);
        return;
      }
      log.devLog(
        `Error: user phone phoneNumber is null, cannot connect to socket`
      );
    } catch (err) {
      log.logAllError(
        `Error setting up socket and listeners to socket. Top level error. Error: ${err}`
      );
    }
  };

  const M_SubscribeClientToNotifications =
    async (): Promise<null | PushSubscription> => {
      const PUBLIC_VAPID_KEY =
        import.meta.env.VITE_WEB_PUSH_VAPID_PUBLIC_KEY || "";

      if (!PUBLIC_VAPID_KEY) {
        throw new Error(
          "Application not receiving web push vapid key from env. Check env immediately!"
        );
      }

      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
        });

        log.logAll("Successfully generated subscription to send to the server");
        return subscription;
      } else {
        return null;
      }
    };

  const M_SetUpSocket = async (
    number: string,
    webPushSubscription: AppData["webPushSubscription"]
  ): Promise<void> => {
    const socketURL = import.meta.env.VITE_API_SOCKET_URL || "";
    if (!socketURL) {
      log.logAllError(
        "No socket url specified! Check server or development env variable immediately",
        socketURL
      );
      throw new Error("Check ENV file for socket url");
    }

    if (webPushSubscription.subscribed === false) {
      webPushSubscription.subscription =
        await M_SubscribeClientToNotifications();
      webPushSubscription.subscribed = false;
    }

    const subscribeInfo = {
      number: number,
      newClient: !webPushSubscription.subscribed,
      subscription: webPushSubscription.subscription,
    };
    log.logAll("Subscribe info to be sent to the server", subscribeInfo);

    socketRef.current = io(socketURL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      query: {
        number: number,
        subscribeInfo: subscribeInfo,
      },
    });

    log.logAll("Attaching event listeners to socket");
    M_AttachListeners(socketRef.current);
  };

  const M_AttachListeners = (socketRef: Socket | null): void => {
    if (!socketRef) {
      return;
    }

    // Attach listeners and call appropriate methods
    socketRef.on("connect", () => {
      M_HandleConnect();
    });
    socketRef.on("disconnect", () => {
      M_HandleDisconnect();
    });
    socketRef.on("connect_error", (error) => {
      M_HandleError(error);
    });
    socketRef.on("text-message", (socketMessage) => {
      log.devLog(
        "Message from the server!!! Socket message from other client with socketMessage attached"
      );
      M_HandleTextMessage(socketMessage);
    });
    socketRef.on("message-update", (update) => {
      log.devLog("Update to message", update);
      M_HandleMessageUpdate(update);
    });
    socketRef.on("delivery-error", (error) => {
      log.devLog("Error delivering message", error);
      M_HandleDeliveryError(error);
    });
    socketRef.on("web-push-sub-success", (subscriptionMessage) => {
      M_HandleWebPushSubscriptionUpdate(subscriptionMessage);
    });
    socketRef.on("messages-read", (fromNumber: string) => {
      M_HandleMessagesRead(fromNumber);
    });
  };

  // Socket Methods ---------------------------------------------------
  const M_HandleConnect = (): void => {
    log.devLog("Connected to server via socket");
  };

  const M_HandleDisconnect = (): void => {
    log.devLog("Socket disconnected from the server");
  };

  const M_HandleError = (error: Error): void => {
    log.logAllError("Socket connection error", error);

    // Call timeout to reconnect 10s
    setTimeout((): void => {
      if (socketRef && socketRef.current) {
        socketRef.current.connect();
      } else {
        return;
      }
    }, 10000);
  };

  const M_HandleTextMessage = useCallback(
    async (socketMessage: Message): Promise<void> => {
      /*
    TODO:
      DEBUG:
        1. When setting up a new message session from a socket message where the session does not currently exist, I seem to be incorrectly setting the contact information for the message session when pushing to allMessages. Inspect how you are retrieving contact information on new message session creations
    */
      const currentAllMessages = allMessagesRef.current;
      const contactReference =
        contacts.find((c: Contacts) => c.number === socketMessage.fromnumber) ||
        null;

      if (socketMessage) {
        log.devLog("Message from socket", socketMessage);

        /*
          NOTE:
            Update local delivered at state immediately on messages from others
        */
        socketMessage.delivered = true;
        socketMessage.deliveredat = new Date();

        // Call getter to ensure fresh allMessages map out of state

        if (!currentAllMessages.has(socketMessage.fromnumber)) {
          log.devLog(
            "allMessages map does not contain the phone number for some reason",
            socketMessage.fromnumber,
            currentAllMessages
          );

          currentAllMessages.set(socketMessage.fromnumber, {
            contact: contactReference,
            messages: [socketMessage],
          });
        } else {
          log.devLog(
            "newAllMessages does contain from number. Pushing message to array"
          );

          const session = currentAllMessages.get(socketMessage.fromnumber);
          if (session) {
            // Create a new array instead of mutating the old one
            const updatedMessages = [...session.messages, socketMessage];

            currentAllMessages.set(socketMessage.fromnumber, {
              ...session,
              messages: updatedMessages,
            });
          }
        }

        // Trigger rerender. But for who? The entire <Profile /> component? Sounds a bit much
        const newMap = new Map(currentAllMessages);

        setAllMessages(newMap);

        addSuccessNotif(
          contactReference?.name || socketMessage.fromnumber,
          socketMessage.message,
          true,
          []
        );

        try {
          await IDB_AddMessage(socketMessage);
        } catch (err) {
          log.logAllError(
            "Error adding message to indexedDB sending from client",
            err
          );
        }
      } else {
        log.devLogDebug(
          "Socket message came through with unknown data type",
          socketMessage
        );
      }
    },
    [contacts]
  );

  /*
    IMPLEMENT:
      1. Combine M_HandleMessageUpdate and M_HandleDeliveryError below
       into a single function
  */
  const M_HandleMessageUpdate = async (
    update: MessageUpdateType
  ): Promise<void> => {
    log.logAll(
      "Ping update from server about message being delivered to other client",
      update
    );
    const currentMessages = allMessagesRef.current;

    let idbUpdate: Message = defaultMessage;

    const messages: Message[] =
      currentMessages.get(update.sessionNumber)?.messages || [];

    const updatedMessages: Message[] = messages.map((m: Message) => {
      if (m.messageid === update.id) {
        const updatedMessage = {
          ...m,
          delivered: true,
          deliveredat: update.time,
        };

        idbUpdate = updatedMessage;
        return updatedMessage;
      } else {
        return m;
      }
    });

    if (updatedMessages) {
      const session = currentMessages.get(update.sessionNumber);

      if (session) {
        currentMessages.set(update.sessionNumber, {
          ...session,
          messages: updatedMessages,
        });
      }
    }

    const newAllMessages = new Map(currentMessages);

    setAllMessages(newAllMessages);

    try {
      await IDB_UpdateMessage(idbUpdate);
      log.logAll(
        "Successfully updated message in indexedDB about message being delivered to other client"
      );
    } catch (err) {
      log.logAllError(
        "Error when updating message in indexedDB about message being delivered to other client",
        err
      );
    }
  };

  const M_HandleDeliveryError = async (error: MessageDeliveryErrorType) => {
    log.logAll(
      "Error delivering message from server it seems as though the server failed and now the socket is warning us",
      error
    );

    const currentMessages = allMessagesRef.current;

    let idbUpdate: Message = defaultMessage;

    const messages: Message[] =
      currentMessages.get(error.sessionNumber)?.messages || [];

    const updatedMessages: Message[] = messages.map((m: Message) => {
      if (m.messageid === error.messageid) {
        const updatedMessage = {
          ...m,
          delivered: false,
          deliveredat: null,
          sent: false,
          sentat: new Date(),
          error: true,
        };

        idbUpdate = updatedMessage;
        return updatedMessage;
      } else {
        return m;
      }
    });

    if (updatedMessages) {
      const session = currentMessages.get(error.sessionNumber);

      if (session) {
        currentMessages.set(error.sessionNumber, {
          ...session,
          messages: updatedMessages,
        });
      }
    }

    const newAllMessages = new Map(currentMessages);

    setAllMessages(newAllMessages);

    try {
      await IDB_UpdateMessage(idbUpdate);
    } catch (err) {
      log.logAllError(
        "Error when trying to update the message that failed to send to IndexedDB",
        err
      );
    }
  };

  const M_HandleWebPushSubscriptionUpdate = async (subscriptionMessage: {
    message: string;
    subscribed: boolean;
    subscription: PushSubscription | null;
  }) => {
    log.logAll(
      "Server message about subscribing to notifications",
      subscriptionMessage
    );

    try {
      const currentWebPushInfo = getAppData("webPushSubscription");
      currentWebPushInfo.subscribed = subscriptionMessage.subscribed;
      currentWebPushInfo.subscription = subscriptionMessage.subscription;

      await IDB_UpdateAppDataWebPush(currentWebPushInfo);
      log.logAll(
        "IndexedDB Updated to reflect the successful webpush subscription on server and db"
      );
      setAppData((prev) => ({
        ...prev,
        webPushSubscription: currentWebPushInfo,
      }));
    } catch (err) {
      log.logAllError(
        "Error updating app data in indexedDB after creating a subscription",
        err
      );
    }
  };

  const M_HandleMessagesRead = async (fromNumber: string): Promise<void> => {
    log.logAll(
      "Ping from server to update messages to read from the client you sent messages to"
    );
    const usersPhone = await IDB_GetPhoneNumber();

    if (allMessagesRef.current.has(fromNumber)) {
      log.logAll("all messages has the number you are sending messages too");
      const messages = allMessagesRef.current.get(fromNumber)?.messages || [];

      const newMessages = messages.map((m: Message) => {
        if (m.fromnumber === usersPhone) {
          return { ...m, read: true, readat: new Date() };
        } else {
          return m;
        }
      });

      try {
        await IDB_UpdateMessages(newMessages);
        log.logAll(
          "Successfully updated the db with new messages that are read"
        );
      } catch (err) {
        log.logAllError(
          "Error updating messages to read after socket event. Error: ",
          err
        );
      }
    }
  };
  // Socket Methods ---------------------------------------------------

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};
