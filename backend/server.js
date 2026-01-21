import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import http from "http"; // <-- for socket.io
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import workspaceRoute from "./routes/workspace.route.js";
import workspaceRoutes from "./routes/workspace.route.js";

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/workspace", workspaceRoute);
app.use("/api/workspaces", workspaceRoutes);


app.get("/", (req, res) => {
  res.send("saas backend running");
});

// 🔹 Create HTTP server for socket
const server = http.createServer(app);

// 🔹 Socket.IO setup
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend port
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // user email ke room me join karna
  socket.on("join", (userEmail) => {
    socket.join(userEmail);
    console.log(userEmail, "joined room");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// 🔹 Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`SaaS backend running on port ${PORT}`);
});
