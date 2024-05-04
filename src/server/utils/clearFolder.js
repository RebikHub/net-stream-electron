import fs from 'fs-extra'
import { WEBTORRENT_DOWNLOAD_PATH } from '../../index.mjs'

export function clearFolder (folderName) {
  if (!folderName) return

  fs.rmSync(WEBTORRENT_DOWNLOAD_PATH, {
    recursive: true
  })

  fs.emptyDir(folderName, (err) => {
    if (err) {
      console.error(`Ошибка при очистке содержимого папки ${folderName}:`, err)
    } else {
      console.log(`Содержимое папки ${folderName} успешно очищено.`)
    }
  })
}
