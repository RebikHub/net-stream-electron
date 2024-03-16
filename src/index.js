import app from "./app.js";
import { PORT, WEBTORRENT_DOWNLOAD_PATH } from "./config.js";
import { clearFolder } from "./utils/clearFolder.js";

app.listen(PORT, () => {
  clearFolder(WEBTORRENT_DOWNLOAD_PATH);
  console.log(`Server is running on port ${PORT}`);
});
