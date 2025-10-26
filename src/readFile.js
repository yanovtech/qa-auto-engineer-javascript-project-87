import { readFileSync } from 'node:fs'
import path from 'node:path'
import { cwd } from 'node:process'

export default (filePath) => {
  try {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.resolve(cwd(), filePath)
    return readFileSync(fullPath, 'utf-8')
  }
  catch (e) {
    throw new Error(`Не удалось прочитать файл: ${filePath}\n${e.message}`)
  }
}
