import _ from 'lodash'

const INDENT_SIZE = 4
const NEW_VALUE_PREFIX = '+ '
const OLD_VALUE_PREFIX = '- '

const getIndent = depth => ' '.repeat(depth * INDENT_SIZE - 2)
const getBracketIndent = depth => ' '.repeat((depth - 1) * INDENT_SIZE)

const stringify = (value, depth) => {
  if (!_.isPlainObject(value)) {
    return String(value)
  }

  const lines = Object.entries(value).map(([key, val]) => `${getIndent(depth + 1)}  ${key}: ${stringify(val, depth + 1)}`)

  return ['{', ...lines, `${getBracketIndent(depth + 1)}}`].join('\n')
}

const formatStylish = (tree, depth = 1) => {
  const lines = tree.flatMap((node) => {
    const indent = getIndent(depth)

    switch (node.status) {
      case 'added':
        return `${indent}${NEW_VALUE_PREFIX}${node.key}: ${stringify(node.value, depth)}`
      case 'deleted':
        return `${indent}${OLD_VALUE_PREFIX}${node.key}: ${stringify(node.value, depth)}`
      case 'combined':
        return [
          `${indent}${OLD_VALUE_PREFIX}${node.key}: ${stringify(node.oldValue, depth)}`,
          `${indent}${NEW_VALUE_PREFIX}${node.key}: ${stringify(node.newValue, depth)}`,
        ]
      case 'nested':
        return `${indent}  ${node.key}: ${formatStylish(node.children, depth + 1)}`
      case 'unchanged':
        return `${indent}  ${node.key}: ${stringify(node.value, depth)}`
      default:
        throw new Error(`Unknown status: ${node.status}`)
    }
  })

  return ['{', ...lines, `${getBracketIndent(depth)}}`].join('\n')
}

export default formatStylish
