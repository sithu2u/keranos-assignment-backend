import express from "express";
import http from "http";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import examTemplateRoutes from "./routes/examTemplateRoutes.js";
import studentAnswerRoutes from "./routes/studentAnswerRoutes.js";
// import scanJobRoutes from "./routes/scanJobRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_CONNECTION = process.env.MONGODB_CONNECTION;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(path.dirname(__filename));

const app = express();
const server = http.createServer(app);

// Craete Database connection
mongoose.connect(MONGODB_CONNECTION, {});
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CORS

app.use((req, res, next) => {
  // res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // or '*' if no credentials
  const origin = req.headers.origin;
  const allowOrigins = ["http://localhost:5173"];

  if (allowOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin); //* for all
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

//Set static Folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//define routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/exam-templates", studentAnswerRoutes);
app.use("/api/exam-templates", examTemplateRoutes);
// app.use("/api/scan-jobs", scanJobRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
