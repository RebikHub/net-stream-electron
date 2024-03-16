import { app, BrowserWindow } from "electron";
import path, { dirname } from "path";
import url, { fileURLToPath } from "url";
import appExpress from "./src/app.js";
import { PORT, WEBTORRENT_DOWNLOAD_PATH } from "./src/config.js";
import { clearFolder } from "./src/utils/clearFolder.js";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;

appExpress.listen(PORT, () => {
  clearFolder(WEBTORRENT_DOWNLOAD_PATH);
  console.log(`Server is running on port ${PORT}`);
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const startUrl = `http://localhost:${PORT}`;
  url.format({
    pathname: path.join(__dirname, "build", "index.html"),
    protocol: "file:",
    slashes: true,
  });

  mainWindow.loadURL(startUrl);

  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => (mainWindow = null));

  // Скрыть верхнее меню, когда окно находится в полноэкранном режиме
  mainWindow.on("enter-full-screen", () => {
    mainWindow.setMenuBarVisibility(false);
  });

  // Показать верхнее меню, когда окно выходит из полноэкранного режима
  mainWindow.on("leave-full-screen", () => {
    mainWindow.setMenuBarVisibility(true);
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
