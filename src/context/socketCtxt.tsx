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
import { AppSettingsType } from "../types/appDataTypes";
import { ContactType } from "../types/contactTypes";
import { NewMessageArrayBuffersType } from "../types/cryptoTypes";
import {
  Base64StringType,
  MessageDeliveryErrorType,
  MessageType,
  MessageUpdateType,
  SocketMessageType,
} from "../types/messageTypes";
import { SocketProps } from "../types/socketTypes";
import { defaultMessage } from "../utils/constants";
import {
  Crypto_DecryptRawAESKeyFromSenderWithRSAPrivateKey,
  Crypto_GenAESKeyAndExportAsArrayBuffer,
  Crypto_GetPlainText,
  Crypto_ImportAESKeyFromSender,
  Crypto_ImportPrivateRSAKey,
  Crypto_NewMessageToArrayBuffers,
} from "../utils/crypto";
import { tryCatch, urlBase64ToUint8Array } from "../utils/helpers";
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
    IDB_AppendMessages,
  } = useDatabase();
  const { messageSessionsMap, contacts, setMessageSessionsMap } =
    useContext(UserCtxt);
  const { getAppData, setAppData, getUserData } = useConfig();
  const { addSuccessNotif } = useNotifActions();

  /*
    TODO:
      IMPLEMENT:
        1. Add a reusable method for sending a new subscription to the server
        2. Go through and make sure that where ever we are updating the allMessageMap we are
        correctly setting the users rsaPublic key for the message session
  */

  const log = useLogger();

  // UseRef for socket to avoid unwanted rerenders
  const socketRef = useRef<Socket | null>(null);
  // Freshers messageSessionsMap data made available for M_HandleTextMessage
  const messageSessionsMapRef = useRef(messageSessionsMap);

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

  // Make sure we always have the freshest messageSessionsMap data from UserCtxt inside of the attached socket listener M_HandleTextMessage
  useEffect(() => {
    messageSessionsMapRef.current = messageSessionsMap;
  }, [messageSessionsMap]);
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
    webPushSubscription: AppSettingsType["webPushSubscription"]
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

    M_FetchLatestMessages();
  };

  const M_FetchLatestMessages = () => {
    const currentMessageSessions = messageSessionsMapRef.current;

    const keys: string[] = Array.from(currentMessageSessions.keys());

    const updates: { number: string; latestDate: Date }[] = keys.map(
      (k: string) => {
        const session = currentMessageSessions.get(k);

        const sessionMessages = session?.messages || [];

        if (sessionMessages.length < 1) {
          return { number: k, latestDate: new Date(0) };
        }

        const message = sessionMessages[sessionMessages.length - 1];

        if (!message) {
          return { number: k, latestDate: new Date(0) };
        }

        const mostRecentMessageDate = message.sentat || new Date(0);

        return { number: k, latestDate: mostRecentMessageDate };
      }
    );

    socketRef.current
      ? socketRef.current.emit("query-latest-messages", updates)
      : null;
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
    socketRef.on("ping-latest-messages", (updates) =>
      M_HandleLatestMessageUpdates(updates)
    );
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
    async (socketMessage: SocketMessageType): Promise<void> => {
      /*
    TODO:
      DEBUG:
        1. Inspect how you are retrieving contact information on new message 
           session creations and update data accordingly
      IMPORTANT!!!: 
        Left off here!!!!!!!!!!!!!!!!
    */
      if (socketMessage) {
        const encryptedMessage: Base64StringType = socketMessage.message;
        const IV: Base64StringType = socketMessage.iv;
        const sendersAESKey: Base64StringType = socketMessage.encryptedAESKey;

        const usersPrivateRSAKeyBuffer: ArrayBuffer =
          getUserData("RSAKeyPair").private;

        if (
          !usersPrivateRSAKeyBuffer ||
          !IV ||
          !encryptedMessage ||
          !usersPrivateRSAKeyBuffer ||
          !sendersAESKey
        ) {
          log.logAllError(
            `Error in socket message, missing values. IV: ${IV}. encryptedMessage: ${encryptedMessage}. userPrivateRSAKey: ${usersPrivateRSAKeyBuffer}`
          );
          return;
        }

        // Turn Base64Strings into ArrayBuffers so they can be imported/exported/decrypted
        const newMessageArrayBuffers: NewMessageArrayBuffersType =
          Crypto_NewMessageToArrayBuffers(encryptedMessage, IV, sendersAESKey);

        // Import users private key as CryptoKey
        const { data: usersPrivateRSAKey, error: RSAPrivateKeyImportError } =
          await tryCatch<CryptoKey>(() =>
            Crypto_ImportPrivateRSAKey(usersPrivateRSAKeyBuffer)
          );

        if (RSAPrivateKeyImportError || !usersPrivateRSAKey) {
          throw new Error(
            `Error importing personal RSA key. ${RSAPrivateKeyImportError}`
          );
        }

        const { data: decryptedSendersAESKey, error: AESKeyDecryptionError } =
          await tryCatch<ArrayBuffer>(() =>
            Crypto_DecryptRawAESKeyFromSenderWithRSAPrivateKey(
              usersPrivateRSAKey,
              newMessageArrayBuffers.senderAESKey
            )
          );

        if (AESKeyDecryptionError || !decryptedSendersAESKey) {
          throw new Error(
            `Error decrypting aes key form sender. Check crypto.js. ${AESKeyDecryptionError}`
          );
        }

        const { data: AESCryptoKeyFromSender, error: AESKeyImportError } =
          await tryCatch(() =>
            Crypto_ImportAESKeyFromSender(decryptedSendersAESKey)
          );

        if (AESKeyImportError || !AESCryptoKeyFromSender) {
          throw new Error(
            `Error importing AES key as crypto key. ${AESKeyImportError}`
          );
        }

        const { data: decryptedMessage, error: decryptingMessageError } =
          await tryCatch(() =>
            Crypto_GetPlainText(
              newMessageArrayBuffers.IV,
              AESCryptoKeyFromSender,
              newMessageArrayBuffers.encryptedMessage
            )
          );

        if (decryptingMessageError || !decryptedMessage) {
          throw new Error(
            `Error decrypting message from sender. ${decryptingMessageError}`
          );
        }

        const decodedMessageText = new TextDecoder().decode(decryptedMessage);

        const messageToStore: MessageType = {
          messageid: socketMessage.messageid,
          message: decodedMessageText,
          sent: true,
          sentat: socketMessage.sentat,
          delivered: true,
          deliveredat: new Date(),
          read: socketMessage.read,
          readat: socketMessage.readat,
          fromnumber: socketMessage.fromnumber,
          tonumber: socketMessage.tonumber,
          error: false,
          synced: socketMessage.synced,
        };

        const currentAllMessages = messageSessionsMapRef.current;
        const contactReference =
          contacts.find(
            (c: ContactType) => c.number === messageToStore.fromnumber
          ) || null;

        log.devLog("Message from socket", messageToStore);

        /*
          NOTE:
            Update local delivered at state immediately on messages from others
        */
        messageToStore.delivered = true;
        messageToStore.deliveredat = new Date();

        // Call getter to ensure fresh messageSessionsMap map out of state

        if (!currentAllMessages.has(messageToStore.fromnumber)) {
          log.devLog(
            "messageSessionsMap map does not contain the phone number for some reason",
            messageToStore.fromnumber,
            currentAllMessages
          );

          const { data: newAESKey, error: AESExportError } = await tryCatch(
            Crypto_GenAESKeyAndExportAsArrayBuffer
          );

          if (AESExportError || !newAESKey) {
            throw new Error(
              `Error generating AES key. Check Crypto_GenAESKey in crypto.ts. Error: ${AESExportError}`
            );
          }

          currentAllMessages.set(messageToStore.fromnumber, {
            contact: contactReference,
            messages: [messageToStore],
            AESKey: newAESKey,
            receiversRSAPublicKey: null,
          });
        } else {
          log.devLog(
            "newAllMessages does contain from number. Pushing message to array"
          );

          const session = currentAllMessages.get(messageToStore.fromnumber);
          if (session) {
            // Create a new array instead of mutating the old one
            const updatedMessages = [...session.messages, messageToStore];

            currentAllMessages.set(messageToStore.fromnumber, {
              ...session,
              messages: updatedMessages,
            });
          }
        }

        // Trigger rerender. But for who? The entire <Profile /> component? Sounds a bit much
        const newMap = new Map(currentAllMessages);

        setMessageSessionsMap(newMap);

        addSuccessNotif(
          contactReference?.name || messageToStore.fromnumber,
          messageToStore.message, // Must be decrypted first !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          true,
          []
        );

        try {
          await IDB_AddMessage(messageToStore);
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
    const currentMessages = messageSessionsMapRef.current;

    let idbUpdate: MessageType = defaultMessage;

    const messages: MessageType[] =
      currentMessages.get(update.sessionNumber)?.messages || [];

    const updatedMessages: MessageType[] = messages.map((m: MessageType) => {
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

    setMessageSessionsMap(newAllMessages);

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

    const currentMessages = messageSessionsMapRef.current;

    let idbUpdate: MessageType = defaultMessage;

    const messages: MessageType[] =
      currentMessages.get(error.sessionNumber)?.messages || [];

    const updatedMessages: MessageType[] = messages.map((m: MessageType) => {
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

    setMessageSessionsMap(newAllMessages);

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

    const currentMessageSession = messageSessionsMapRef.current;

    if (currentMessageSession.has(fromNumber)) {
      log.logAll("all messages has the number you are sending messages too");

      const currentSession = currentMessageSession.get(fromNumber);

      if (!currentSession) {
        return;
      }

      const messages = currentSession?.messages || [];

      const newMessages = messages.map((m: MessageType) => {
        if (m.fromnumber === usersPhone) {
          return { ...m, read: true, readat: new Date() };
        } else {
          return m;
        }
      });

      currentMessageSession.set(fromNumber, {
        contact: currentSession.contact || null,
        messages: newMessages,
        AESKey: currentSession.AESKey,
        receiversRSAPublicKey: currentSession.receiversRSAPublicKey,
      });

      const newMap = new Map(currentMessageSession);

      setMessageSessionsMap(newMap);

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

  const M_HandleLatestMessageUpdates = async (
    updates: {
      sessionNumber: string;
      messages: MessageType[];
    }[]
  ) => {
    const currentMessageSession = messageSessionsMapRef.current;

    /*
      DESC:
        Loop through all of the updates and update messageSessionsMap accordingly
      IMPLEMENT: 
        1. Update indexedDB.
    */
    updates.forEach(
      async (update: { sessionNumber: string; messages: MessageType[] }) => {
        if (currentMessageSession.has(update.sessionNumber)) {
          const currentSession = currentMessageSession.get(
            update.sessionNumber
          );

          if (!currentSession) {
            return;
          }

          const currentMessages = currentSession?.messages || [];

          const updatedMessages = currentMessages.concat(update.messages);

          currentMessageSession.set(update.sessionNumber, {
            contact: currentSession?.contact || null,
            messages: updatedMessages,
            AESKey: currentSession?.AESKey,
            receiversRSAPublicKey: currentSession.receiversRSAPublicKey,
          });

          try {
            await IDB_AppendMessages(update.messages);
            log.logAll(
              "IndexedDB updated successfully, added synchronized messages from server"
            );
          } catch (err) {
            log.logAll(
              "Error appending messages to indexedDB from socket 'ping-latest-messages'. M_HandleLatestMessageUpdates",
              err
            );
          }
        }
      }
    );

    const newMessagesMap = new Map(currentMessageSession);

    setMessageSessionsMap(newMessagesMap);
  };
  // Socket Methods ---------------------------------------------------

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};
