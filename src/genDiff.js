import _ from 'lodash'
import readFile from './readFile.js'
import { jsonParse, yamlParse } from './parse.js'
import makeDefault from './options/makeStylish.js'
import makePlain from './options/makePlain.js'
import makeJson from './options/makeJson.js'

const combineObjects = (firstObj, secondObj) => {
  const allKeys = _.union(Object.keys(firstObj), Object.keys(secondObj)).sort()

  return allKeys.map((key) => {
    const hasFirst = Object.hasOwn(firstObj, key)
    const hasSecond = Object.hasOwn(secondObj, key)

    const val1 = firstObj[key]
    const val2 = secondObj[key]

    if (!hasFirst) {
      return { key, value: val2, status: 'added' }
    }
    if (!hasSecond) {
      return { key, value: val1, status: 'deleted' }
    }
    if (_.isPlainObject(val1) && _.isPlainObject(val2)) {
      return { key, children: combineObjects(val1, val2), status: 'nested' }
    }
    if (_.isEqual(val1, val2)) {
      return { key, value: val1, status: 'unchanged' }
    }
    else {
      return { key, oldValue: val1, newValue: val2, status: 'combined' }
    }
  })
}

const parseFile = file => file.split('.')[1] === 'json' ? jsonParse(file) : yamlParse(file)

const makeOption = (obj, option) => {
  const options = {
    stylish: makeDefault,
    plain: makePlain,
    json: makeJson,
  }
  return options[option](obj)
}

export default (firstFilePath, secondFilePath, option = 'stylish') => {
  const firstFile = readFile(firstFilePath)
  const secondFile = readFile(secondFilePath)
  const firstObj = parseFile(firstFile)
  const secondObj = parseFile(secondFile)

  const combinedObj = combineObjects(firstObj, secondObj)
  return makeOption(combinedObj, option)
}
