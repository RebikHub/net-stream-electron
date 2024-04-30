import fs from 'fs-extra'
// import path from 'path'

// Функция для очистки содержимого папки с проверкой на наличие файлов
export function clearFolder (folderName) {
  // Получаем текущий рабочий каталог
  // const currentDirectory = process.cwd()

  // Создаем полный путь к папке
  // const folderPath = path.join(currentDirectory, folderName);
  console.log('folder-name: ', folderName)

  if (!folderName) return
  // Получаем список файлов в папке
  fs.readdir(folderName, (err, files) => {
    if (err) {
      console.error(`Ошибка при чтении содержимого папки ${folderName}:`, err)
      return
    }

    // Проверяем, есть ли файлы в папке
    if (files.length > 0) {
      fs.emptyDir(folderName, (err) => {
        if (err) {
          console.error(
            `Ошибка при очистке содержимого папки ${folderName}:`,
            err
          )
        } else {
          console.log(`Содержимое папки ${folderName} успешно очищено.`)
        }
      })
    } else {
      // Очищаем содержимое папки (без удаления самой папки)
      console.log(`В папке ${folderName} нет файлов. Нечего чистить.`)
    }
  })
}
