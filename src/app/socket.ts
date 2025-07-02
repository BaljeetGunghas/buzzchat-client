// client/socket.ts
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket", "polling"],
  autoConnect: false,
});

export default socket;
