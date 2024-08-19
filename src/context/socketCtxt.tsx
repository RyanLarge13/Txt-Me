/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { SocketProps } from "../types/socketTypes";
import io, { Socket } from "socket.io-client";

const SocketContext = createContext({} as SocketProps);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    try {
      const userJSON: string | null = localStorage.getItem("user");
      if (userJSON && socketRef) {
        const number = JSON.parse(userJSON).phoneNumber;
        socketRef.current = io(import.meta.env.VITE_API_SOCKET_URL, {
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          query: {
            number: number,
          },
        });
        socketRef.current.on("connect", () => {
          console.log("Connected to the server");
        });
        socketRef.current.on("disconnect", () => {
          console.log("Disconnected from the server");
        });
        socketRef.current.on("connect_error", (error) => {
          console.log("Connection error:", error);
        });
        socketRef.current.on("text-message", (socketMessage) => {
          console.log("message from socket, updating messages", socketMessage);
          setMessage(socketMessage);
        });
      }
    } catch (err) {
      console.log(err);
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [socketRef]);

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, message: message }}
    >
      {children}
    </SocketContext.Provider>
  );
};
