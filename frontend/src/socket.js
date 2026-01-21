import { io } from "socket.io-client";

// Connect to backend socket server
export const socket = io("http://localhost:3000", {
  withCredentials: true, // allow cookies if needed
});
