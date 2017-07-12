// @flow

const getDescendantCount = (node: Node) => {
  let count = node.childNodes.length

  Array.from(node.childNodes).forEach(c => {
    count += getDescendantCount(c)
  })

  return count
}

const getNodeAtIndex = (node: Node, index: number): Node | null => {
  if (index === 0) {
    return node
  }

  const childCount = node.childNodes.length

  let i
  let offset = 0

  for (i = 0; i < childCount; i += 1) {
    const childNode = node.childNodes[i]
    const childDescendantCount = getDescendantCount(childNode)

    if (index - offset - 1 <= childDescendantCount) {
      return getNodeAtIndex(childNode, index - offset - 1)
    }

    offset += childDescendantCount + 1
  }

  return null
}

export default getNodeAtIndex
