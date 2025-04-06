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

import React, { createContext, useContext, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

import UserCtxt from "../context/userCtxt";
import useLogger from "../hooks/useLogger";
import { SocketProps } from "../types/socketTypes";
import { Contacts, Message } from "../types/userTypes";
import { useDatabase } from "./dbContext";

export const SocketContext = createContext({} as SocketProps);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { getPhoneNumber, IDB_AddMessage } = useDatabase();
  const { allMessages, contacts, setAllMessages } = useContext(UserCtxt);
  const log = useLogger();

  // UseRef for socket to avoid unwanted rerenders
  const socketRef = useRef<Socket | null>(null);

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
  // useEffects -------------------------------------------------------

  // Local Scop Context Methods ---------------------------------------
  const M_QueryPhoneNumber = async () => {
    const phoneNumber = await getPhoneNumber();
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
      return;
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
      console.log(
        "Message from the server!!! Socket message from other client with socketMessage attached"
      );
      M_HandleTextMessage(socketMessage);
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

  const M_HandleTextMessage = (socketMessage: Message): void => {
    /*
    TODO:
      DEBUG:
        1. When setting up a new message session from a socket message where the session does not currently exist, I seem to be incorrectly setting the contact information for the message session when pushing to allMessages. Inspect how you are retrieving contact information on new message session creations
    */

    if (socketMessage) {
      log.devLog("Message from socket", socketMessage);

      if (!allMessages.has(socketMessage.fromnumber)) {
        allMessages.set(socketMessage.fromnumber, {
          contact:
            contacts.find(
              (c: Contacts) => c.number === socketMessage.fromnumber
            ) || null,
          messages: [socketMessage],
        });
      } else {
        allMessages.get(socketMessage.fromnumber)?.messages.push(socketMessage);
      }

      // Trigger rerender. But for who? The entire <Profile /> component? Sounds a bit much
      const newMap = new Map(allMessages);

      setAllMessages(newMap);
      M_AddMessageToIndexedDB(socketMessage);
    } else {
      log.devLogDebug(
        "Socket message came through with unknown data type",
        socketMessage
      );
    }
  };

  const M_AddMessageToIndexedDB = async (newMessage: Message) => {
    try {
      await IDB_AddMessage(newMessage);
    } catch (err) {
      log.logAllError(
        "Error adding message to indexedDB sending from client",
        err
      );
    }
  };

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};
