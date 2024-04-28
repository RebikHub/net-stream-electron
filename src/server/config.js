import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
export const PORT = process.env.PORT || 8000
console.log(__dirname)
// export const WEBTORRENT_DOWNLOAD_PATH = path.join(__dirname, '/downloads')
export const CONTENT_TV = path.join(__dirname, '/content/tv')
export const CONTENT_URLS = path.join(__dirname, '/content/urls')
export const TV_CHANNELS_URL = 'https://iptv-org.github.io/api/channels.json'
export const TV_STREAMS_URL = 'https://iptv-org.github.io/api/streams.json'
export const RUTOR_URL = 'https://rutor.org'

export const MAGNET_KEY = 'magnet:?xt'
export const SPLIT_MAGNET_STRING = 'urn:btih:'

export const FILTER_ARRAY = [1, 5, 7, 10, 4, 16]

export const IMDB_SEARCH_URL = 'https://api.themoviedb.org/3'

export const TORRENT_URLS = [
  'https://6-ffyg.123tt.ru',
  'https://3-new-rutor.123rutor.su',
  'https://9-ixwrqnqb.123tt.ru',
  'https://9-fkqg.123tt.ru',
  'https://6-lrea.123tt.ru'
]

// const { app, dialog } = require('electron');
// const fs = require('fs');
// const path = require('path');

// Создаем временную директорию для скачивания
// const downloadFolder = fs.mkdtempSync(path.join(app.getPath('temp'), 'stream-downloads'));

// // Выбор и скачивание файла
// function downloadFile() {
//   dialog.showOpenDialog({ properties: ['openFile'] }).then(result => {
//     if (!result.canceled) {
//       const filePath = result.filePaths[0];
//       const targetPath = path.join(downloadFolder, path.basename(filePath));

//       fs.copyFile(filePath, targetPath, (err) => {
//         if (err) throw err;
//         console.log('File downloaded successfully!');
//       });
//     }
//   });
// }

// // Просмотр файла в процессе скачивания
// function viewFile(fileName) {
//   const filePath = path.join(downloadFolder, fileName);
//   fs.readFile(filePath, 'utf8', (err, data) => {
//     if (err) throw err;
//     console.log(data);
//   });
// }

// Удаление скачанных файлов при закрытии приложения
// app.on('before-quit', () => {
//   fs.readdir(downloadFolder, (err, files) => {
//     if (err) throw err;

//     files.forEach(file => {
//       fs.unlink(path.join(downloadFolder, file), err => {
//         if (err) throw err;
//         console.log(`${file} deleted successfully!`);
//       });
//     });
//   });
// });
