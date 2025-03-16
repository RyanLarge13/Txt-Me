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
import { Message } from "../types/userTypes";
import { useDatabase } from "./dbContext";

export const SocketContext = createContext({} as SocketProps);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { getPhoneNumber } = useDatabase();
  const { allMessages, setAllMessages } = useContext(UserCtxt);
  const log = useLogger();

  // UseRef for socket to avoid unwanted rerenders
  const socketRef = useRef<Socket | null>(null);

  // useEffects -----------------------------------------------------
  useEffect(() => {
    queryPhoneNumber();

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
  const queryPhoneNumber = async () => {
    const phoneNumber = await getPhoneNumber();
    try {
      if (phoneNumber && socketRef) {
        setUpSocket(phoneNumber);
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

  const setUpSocket = (number: string): void => {
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

    attachListeners(socketRef.current);
  };

  const attachListeners = (socketRef: Socket | null): void => {
    if (!socketRef) {
      return;
    }

    // Attach listeners and call appropriate methods
    socketRef.on("connect", () => {
      handleConnect();
    });
    socketRef.on("disconnect", () => {
      handleDisconnect();
    });
    socketRef.on("connect_error", (error) => {
      handleError(error);
    });
    socketRef.on("text-message", (socketMessage) => {
      console.log(
        "Message from the server!!! Socket message from other client with socketMessage attached"
      );
      handleTextMessage(socketMessage);
    });
  };

  // Socket Methods ---------------------------------------------------
  const handleConnect = (): void => {
    log.devLog("Connected to server via socket");
  };

  const handleDisconnect = (): void => {
    log.devLog("Socket disconnected from the server");
  };

  const handleError = (error: Error): void => {
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

  const handleTextMessage = (socketMessage: Message): void => {
    if (socketMessage) {
      log.devLog("Message from socket", socketMessage);

      if (!allMessages.has(socketMessage.fromnumber)) {
        allMessages.set(socketMessage.fromnumber, {
          contact: null,
          // Contacts set to null for now until i fetch contacts from the server and correctly store them in the local DB
          messages: [socketMessage],
        });
      } else {
        allMessages.get(socketMessage.fromnumber)?.messages.push(socketMessage);
      }

      // Trigger rerender. But for who? The entire <Profile /> component? Sounds a bit much
      const newMap = new Map(allMessages);
      setAllMessages(newMap);
    } else {
      log.devLogDebug(
        "Socket message came through with unknown data type",
        socketMessage
      );
    }
  };
  // Socket Methods ---------------------------------------------------
  // Local Scop Context Methods ---------------------------------------

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};
