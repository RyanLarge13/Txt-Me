// SocketContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import io from "socket.io-client";

const SocketContext = createContext({});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    const number = JSON.parse(localStorage.getItem("user")).phoneNumber;
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
    socketRef.current.on("text-message", (message) => {
      console.log("message from socket, updating messages", message);
      setMessages((prev) => [...prev, message]);
    });
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, messages }}>
      {children}
    </SocketContext.Provider>
  );
};
