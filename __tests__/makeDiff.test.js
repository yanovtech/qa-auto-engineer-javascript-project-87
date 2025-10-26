import path from 'path'
import { fileURLToPath } from 'url'
import makeDiff from '../src/genDiff.js'
import readFile from '../src/readFile.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const getFixturePath = name => path.join(dirname, '..', '__fixtures__', name)

let expectedResults

beforeEach(() => {
  expectedResults = {
    stylish: readFile(getFixturePath('stylishResult.txt')),
    plain: readFile(getFixturePath('plainResult.txt')),
    json: readFile(getFixturePath('jsonResult.txt')),
  }
})

const filePairs = [
  ['file1.json', 'file2.json'],
  ['file1.yaml', 'file2.yml'],
  ['file1.json', 'file2.yml'],
  ['file1.yaml', 'file2.json'],
]

const formats = ['stylish', 'plain', 'json']

formats.forEach(format =>
  describe(`makeDiff with format "${format}"`, () => {
    test.each(filePairs)('%s vs %s', (file1, file2) => {
      const filePath1 = getFixturePath(file1)
      const filePath2 = getFixturePath(file2)
      const result = makeDiff(filePath1, filePath2, format)
      expect(result).toBe(expectedResults[format])
    })
  }),
)
