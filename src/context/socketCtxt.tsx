/// <reference types="vite/client" />

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";

import useLocalStorage from "../hooks/useLocalStorage";
import { SocketProps } from "../types/socketTypes";
import { User } from "../types/userTypes";

const SocketContext = createContext({} as SocketProps);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  // Local Storage State --------------------------------------------
  const [userJSON, userJSONFailed, _] = useLocalStorage<User | null>("user");
  // Local Storage State --------------------------------------------

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
    try {
      if (userJSON && socketRef) {
        const number = userJSON?.phoneNumber || null;

        if (number === null) {
          console.error(
            `Error: user phone number is null, cannot connect to socket`
          );
          // Do something
          return;
        }

        setUpSocket(number);
      }
    } catch (err) {
      console.error(
        `Error setting up socket and listeners to socket. Top level error. Error: ${err}`
      );
    }

    // Remove socket and disconnect
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [socketRef]);

  useEffect(() => {
    if (userJSONFailed !== null) {
      console.error(
        `Failed to grab user from local storage with a message: ${userJSONFailed.message}`
      );
      // Do something
    }
  }, [userJSONFailed]);
  // useEffects -------------------------------------------------------

  // Local Scop Context Methods ---------------------------------------
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
