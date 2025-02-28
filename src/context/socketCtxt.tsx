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

import React, { createContext, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

import useLogger from "../hooks/useLogger";
import { SocketProps } from "../types/socketTypes";
import { useDatabase } from "./dbContext";

export const SocketContext = createContext({} as SocketProps);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { getPhoneNumber } = useDatabase();
  const log = useLogger();

  // State ----------------------------------------------------------
  const [message, setMessage] = useState<{
    fromid: string;
    message: string;
    time: string;
  } | null>(null);
  // State ----------------------------------------------------------

  // UseRef for socket to avoid unwanted rerenders
  const socketRef = useRef<Socket | null>(null);

  // useEffects -----------------------------------------------------
  useEffect(() => {
    queryPhoneNumber();

    // Remove socket and disconnect
    return () => {
      if (socketRef.current) {
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
      console.error(
        `Importing env variable SOCKET_URL failed. socket url imported as: ${socketURL}`
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

  const attachListeners = (socketRef): void => {
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
      handleTextMessage(socketMessage);
    });
  };

  // Socket Methods ---------------------------------------------------
  const handleConnect = (): void => {
    console.log("Connected to the server");
  };

  const handleDisconnect = (): void => {
    console.log("Disconnected from the server");
  };

  const handleError = (error): void => {
    console.log("Connection error:", error);
    setTimeout((): void => {
      if (socketRef && socketRef.current) {
        socketRef.current.connect();
      } else {
        return;
      }
    }, 10000);
  };

  const handleTextMessage = (socketMessage): void => {
    if (socketMessage) {
      setMessage(socketMessage);
      console.log("message from socket, updating messages", socketMessage);
    } else {
      console.log(
        `Socket message came through as unknown data type. Message: ${socketMessage}`
      );
    }
  };
  // Socket Methods ---------------------------------------------------
  // Local Scop Context Methods ---------------------------------------

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, message: message }}
    >
      {children}
    </SocketContext.Provider>
  );
};
