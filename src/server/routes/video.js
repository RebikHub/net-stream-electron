import { Router } from "express";
import {
  downloadTorrent,
  streamTorrent,
  streamStats,
  streamVideo,
  addMagnet,
  stopStream,
} from "../controllers/video/torrentController.js";

const router = Router();

router.post("/download", downloadTorrent);

router.get("/torrent/:id", streamTorrent);

router.get("/stream/stats/:infoHash", streamStats);

router.get("/stream/add/:magnet", addMagnet);

router.get("/stream/stop/:infoHash", stopStream);

router.get("/stream/:infoHash/:name", streamVideo);

export default router;