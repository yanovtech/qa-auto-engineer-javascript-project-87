import yaml from 'js-yaml'

export const jsonParse = (json) => {
  try {
    return JSON.parse(json)
  }
  catch (e) {
    throw new Error(`Не удалось обработать json: ${json}\n${e.message}`)
  }
}

export const yamlParse = (yml) => {
  try {
    return yaml.load(yml)
  }
  catch (e) {
    throw new Error(`Не удалось обработать yaml: ${yml}\n${e.message}`)
  }
}
