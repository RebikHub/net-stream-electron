import { app } from 'electron'
import path from 'path'
import fs from 'fs'

export const createFolder = () => {
  const downloadsPath = path.join(app.getPath('temp'), 'stream-downloads')

  return fs.existsSync(downloadsPath) ? downloadsPath : fs.mkdirSync(downloadsPath)
}
