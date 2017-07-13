// @flow

import type {VElement, VNode} from './types'

const toVNode = (node: any): VNode => {
  if (node.nodeType === 1) {
    const type = node.nodeName.toLowerCase()
    const children = Array.from(node.childNodes).map(toVNode)
    const attrs = Array.from(node.attributes).reduce((a, attr) => {
      a[attr.name] = attr.value
      return a
    }, {})

    const vElement: VElement = {
      type,
      attrs,
      children
    }

    return vElement
  }

  return node.textContent
}

export default toVNode
