import WebTorrent from "webtorrent";
import { readJsonId } from "../../utils/readJson.js";
import { WEBTORRENT_DOWNLOAD_PATH } from "../../config.js";
import fs from "fs";

const client = new WebTorrent();

// Функция для добавления торрента и начала загрузки
export const startTorrentDownload = async (magnetLink) => {
  return new Promise((resolve, reject) => {
    // Проверяем, существует ли уже торрент с такой магнитной ссылкой
    const existingTorrent = client.get(magnetLink);

    if (existingTorrent) {
      // Торрент уже существует, не нужно создавать новый клиент или разрушать текущий
      console.log("Торрент уже существует:", existingTorrent);
      client.destroy();
      resolve(existingTorrent.infoHash);
    } else {
      // Торрент еще не существует, добавляем его
      client.add(magnetLink, { path: WEBTORRENT_DOWNLOAD_PATH }, (torrent) => {
        console.log("Торрент добавлен:", torrent.infoHash);

        // Обработчик события "done" для выполнения действий после завершения загрузки
        torrent.on("done", () => {
          console.log("Загрузка завершена!");
        });

        resolve(torrent.infoHash);
      });

      // Обработчик ошибок для добавления торрента
      client.once("error", (err) => {
        console.error("Ошибка при добавлении торрента:", err);
        reject(err);
      });
    }
  });
};

// Функция для начала стриминга торрента
export const startStreamTorrent = async (magnetLink) => {
  return new Promise((resolve, reject) => {
    const torrent = client.add(magnetLink, { path: WEBTORRENT_DOWNLOAD_PATH });

    // Обработчик ошибок стриминга торрента
    torrent.once("error", (err) => {
      console.error("Ошибка при начале стриминга торрента:", err);
      reject(err);
    });

    // Обработчик события "done" для выполнения действий после завершения стриминга
    torrent.once("done", () => {
      console.log("Стриминг завершен!");
      resolve({
        message: "Torrent download completed.",
        filePath: torrent.path,
      });
    });
  });
};

// Функция для предоставления статистики стриминга
export const streamStats = async (req, res) => {
  const infoHash = req.params.infoHash;
  try {
    const torrent = client.get(infoHash);
    console.log("stats-torrent: ", torrent);
    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    };
    res.writeHead(200, headers);

    const intervalId = setInterval(() => {
      res.write(
        `data: ${JSON.stringify({
          speed: client.downloadSpeed,
          progress: client.progress,
          ratio: client.ratio,
          torrentName: torrent?.name || "",
          torrentProgress: torrent?.progress || "",
          torrentDownLoadSpeed: torrent?.downloadSpeed || "",
          torrentRatio: torrent?.ratio || "",
          torrentUploadSpeed: torrent?.uploadSpeed || "",
        })}\n\n`
      );
    }, 1000);

    // Закрыть соединение при отключении клиента
    req.on("close", () => {
      clearInterval(intervalId);
    });
  } catch (error) {
    console.error("Ошибка при предоставлении статистики стриминга:", error);
    res.status(500).json({ error: "Failed to provide stream stats." });
  }
};

// Функция для начала загрузки торрента
export const downloadTorrent = async (req, res) => {
  try {
    const magnetLink = req.body.magnetLink;
    console.log(magnetLink);
    const torrentInfo = await startTorrentDownload(magnetLink);
    res.status(200).json(torrentInfo);
  } catch (error) {
    console.error("Ошибка при начале загрузки торрента:", error);
    res.status(500).json({ error: "Failed to start torrent download." });
  }
};

// Функция для начала стриминга торрента
export const streamTorrent = async (req, res) => {
  try {
    const id = req.params.id;
    const magnetLink = await readJsonId(id);
    const torrentInfo = await startStreamTorrent(magnetLink.url);
    res.status(200).json(torrentInfo);
  } catch (error) {
    console.error("Ошибка при начале стриминга торрента:", error);
    res.status(500).json({ error: "Failed to start torrent streaming." });
  }
};

export const addMagnet = async (req, res) => {
  const magnet = req.params.magnet;

  try {
    const torrent = await client.get(magnet);

    if (!torrent) {
      fs.mkdirSync(`${WEBTORRENT_DOWNLOAD_PATH}\\${magnet}`);
      client.add(
        magnet,
        { path: `${WEBTORRENT_DOWNLOAD_PATH}\\${magnet}` },
        (torrent) => {
          const files = torrent.files.map((data) => ({
            name: data.name,
            length: data.length,
          }));

          res.status(200).send({ files });
        }
      );
    } else {
      const files = torrent.files.map((data) => ({
        name: data.name,
        length: data.length,
      }));
      res.status(200).send({ files });
    }
  } catch (error) {
    res
      .status(400)
      .send(`Error add magnet: ${`${WEBTORRENT_DOWNLOAD_PATH}\\${magnet}`}`);
  }
};

export const streamVideo = async (req, res, next) => {
  const {
    params: { name, infoHash },
    headers: { range },
  } = req;

  if (!range) {
    const err = new Error(
      "Range is not defined, please make request from HTML5 Player"
    );
    err.status = 416;
    return next(err);
  }

  const torrentFile = await client.get(infoHash);

  let file = {};

  if (torrentFile) {
    for (let i = 0; i < torrentFile.files.length; i++) {
      const currentTorrentPiece = torrentFile.files[i];
      if (currentTorrentPiece.name === name) {
        file = currentTorrentPiece;
      }
    }

    const fileSize = file.length;
    const [startParsed, endParsed] = range.replace(/bytes=/, "").split("-");

    const start = Number(startParsed);
    const end = endParsed ? Number(endParsed) : fileSize - 1;

    const chunkSize = end - start + 1;

    const headers = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);

    const streamPositions = {
      start,
      end,
    };

    const stream = file.createReadStream(streamPositions);

    console.log("start-stream");

    stream.pipe(res);

    // stream.on('')

    stream.on("error", (err) => {
      console.log("stream-error: ", err);
      // Обработка ошибок в middleware или контроллере
      next(err);
    });

    stream.on("end", () => {
      console.log("stream-end");
      res.end(); // Закрыть поток после завершения передачи данных
    });

    res.on("close", () => {
      console.log("response-closed");
      stream.destroy(); // В случае, если клиент закрыл соединение, уничтожить поток
    });
  }
};

export const stopStream = async (req, res, next) => {
  const infoHash = req.params.infoHash;
  const torrent = await client.get(infoHash);

  if (torrent) {
    torrent.destroy((err) => {
      if (err) {
        console.error("Ошибка при остановке: " + err.message);
        // Обработка ошибок в middleware или контроллере
        next(err);
      } else {
        console.log("Загрузка или стрим остановлены");
        fs.rmSync(`${WEBTORRENT_DOWNLOAD_PATH}\\${infoHash}`, {
          recursive: true,
        });
        res.status(200).end();
      }
    });
  }
};
