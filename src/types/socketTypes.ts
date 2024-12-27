import { Socket } from "socket.io-client";

export interface SocketProps {
  socket: Socket | null;
  message: {
    fromid: string;
    message: string;
    time: string;
  } | null;
}
