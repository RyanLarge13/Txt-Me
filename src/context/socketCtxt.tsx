import React, { createContext, useState, ReactNode, useEffect } from "react";
import { io } from "socket.io-client";
const SocketCtxt = createContext({} /*as SocketProps*/);

export const SocketProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [socket, setSocket] = useState(
    // io("ws://txt-me-server-production.up.railway.app/")
    io("ws://localhost:8080/")
  );
  const [socketEvents, setSocketEvents] = useState([]);

  useEffect(() => {
    socket.on("text-message", (event): void => {
      setSocketEvents((prev) => [...prev, event]);
    });
    socket.on("connect", (): void => {
      console.log("Connected");
    });
    socket.io.on("error", (err): void => {
      console.log(err);
    });
    return () => {
      socket.off("error");
      socket.off("connection");
    };
  }, []);

  return (
    <SocketCtxt.Provider
      value={{
        socket,
        setSocket,
        socketEvents,
        setSocketEvents,
      }}
    >
      {children}
    </SocketCtxt.Provider>
  );
};

export default SocketCtxt;
