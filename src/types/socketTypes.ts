import { Socket } from "socket.io-client";

export interface SocketProps {
  socket: Socket | null;
  message: {
    from: string;
    message: string;
    time: Date;
  } | null;
}
