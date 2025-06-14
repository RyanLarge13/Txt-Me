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
import {
  MessageDeliveryErrorType,
  MessageUpdateType,
  SocketProps,
} from "../types/socketTypes";
import { Contacts, Message } from "../types/userTypes";
import { defaultMessage } from "../utils/constants";
import { useDatabase } from "./dbContext";

export const SocketContext = createContext({} as SocketProps);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { IDB_GetPhoneNumber, IDB_AddMessage, IDB_UpdateMessage } =
    useDatabase();
  const { allMessages, contacts, setAllMessages } = useContext(UserCtxt);
  const log = useLogger();

  // UseRef for socket to avoid unwanted rerenders
  const socketRef = useRef<Socket | null>(null);
  // Freshers allMessages data made available for M_HandleTextMessage
  const allMessagesRef = useRef(allMessages);

  // useEffects -----------------------------------------------------
  useEffect(() => {
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
    try {
      if (phoneNumber && socketRef) {
        M_SetUpSocket(phoneNumber);
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

  const M_SetUpSocket = (number: string): void => {
    const socketURL = import.meta.env.VITE_API_SOCKET_URL || "";
    if (!socketURL) {
      log.logAllError(
        "No socket url specified! Check server or development env variable immediately",
        socketURL
      );
      throw new Error("Check ENV file for socket url");
    }

    socketRef.current = io(socketURL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      query: {
        number: number,
      },
    });

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
            contact:
              contacts.find(
                (c: Contacts) => c.number === socketMessage.fromnumber
              ) || null,
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
    [contacts, setAllMessages, IDB_AddMessage]
  );

  /*
    IMPLEMENT:
      1. Combine M_HandleMessageUpdate and M_HandleDeliveryError below
       into a single function
  */
  const M_HandleMessageUpdate = useCallback(
    async (update: MessageUpdateType): Promise<void> => {
      const currentMessages = allMessagesRef.current;

      let idbUpdate: Message = defaultMessage;

      const updatedMessages: Message[] =
        currentMessages.get(update.sessionNumber)?.messages ||
        [].map((m: Message) => {
          if (m.messageid === update.id) {
            const updatedMessage = {
              ...m,
              delivered: true,
              deliveredat: new Date(),
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

      setAllMessages(new Map(currentMessages));
      await IDB_UpdateMessage(idbUpdate);
    },
    [allMessagesRef.current]
  );

  const M_HandleDeliveryError = useCallback(
    async (error: MessageDeliveryErrorType) => {
      log.devLog("Error delivering message from server", error);

      const currentMessages = allMessagesRef.current;

      let idbUpdate: Message = defaultMessage;

      const updatedMessages: Message[] =
        currentMessages.get(error.sessionNumber)?.messages ||
        [].map((m: Message) => {
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

      setAllMessages(new Map(currentMessages));
      await IDB_UpdateMessage(idbUpdate);
    },
    [allMessagesRef.current]
  );
  // Socket Methods ---------------------------------------------------

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};
