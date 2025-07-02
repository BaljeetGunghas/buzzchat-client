import { io } from "socket.io-client";

const socket = io("http://localhost:5000", { // or your backend URL
  autoConnect: false, // manual connect
  transports: ["websocket"], // optional but more direct
  withCredentials: true,     // if you're using cookies
});

export default socket;