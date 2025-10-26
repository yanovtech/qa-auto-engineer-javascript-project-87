import _ from 'lodash'

const stringify = (value) => {
  if (_.isPlainObject(value)) {
    return '[complex value]'
  }
  if (typeof value === 'string') {
    return `'${value}'`
  }
  if (value === null) {
    return 'null'
  }
  return String(value)
}

const formatPlain = (tree, path = []) => {
  const lines = tree.flatMap((node) => {
    const fullPath = [...path, node.key].join('.')

    switch (node.status) {
      case 'added':
        return `Property '${fullPath}' was added with value: ${stringify(node.value)}`
      case 'deleted':
        return `Property '${fullPath}' was removed`
      case 'combined':
        return `Property '${fullPath}' was updated. From ${stringify(node.oldValue)} to ${stringify(node.newValue)}`
      case 'nested':
        return formatPlain(node.children, [...path, node.key])
      case 'unchanged':
        return []
      default:
        throw new Error(`Unknown status: ${node.status}`)
    }
  })

  return lines.join('\n')
}

export default formatPlain
