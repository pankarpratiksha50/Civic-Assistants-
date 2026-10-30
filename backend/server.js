import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import authRoutes from "./src/routes/auth.js";
import reportRoutes from "./src/routes/reports.js";
import aiRoutes from "./src/routes/ai.js";
import { ensureAdmin } from "./src/utils/seedAdmin.js";

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const uploadDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(uploadDir));
app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "Civic Assistants API" }));
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/ai", aiRoutes);
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const port = process.env.PORT || 5000;
try {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/civic_assistants");
  await ensureAdmin();
  app.listen(port, () => console.log(`Civic Assistants API running on http://localhost:${port}`));
} catch (error) {
  console.error("Could not start server:", error.message);
  process.exit(1);
}
