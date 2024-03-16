import express from "express";
import cors from "cors";
import apiTvRoutes from "./routes/tv.js";
import apiVideoRoutes from "./routes/video.js";
import apiSearchRoutes from "./routes/search.js";
import path from "node:path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/tv", apiTvRoutes);
app.use("/api/video", apiVideoRoutes);
app.use("/api/search", apiSearchRoutes);

app.use(express.static("build"));

// Обработка всех остальных запросов React приложения
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../build/index.html"));
// });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

export default app;
