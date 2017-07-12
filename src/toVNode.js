// @flow

import type {VElement, VNode} from './types'

const toVNode = (node: any): VNode => {
  if (node.nodeType === 1) {
    const children = Array.from(node.childNodes).map(toVNode)

    const vElement: VElement = {
      type: node.nodeName.toLowerCase(),
      attrs: {},
      children
    }

    if (node.id) {
      vElement.attrs.id = node.id
    }

    Array.from(node.attributes).forEach(attr => {
      vElement.attrs[attr.name] = attr.value
    })

    return vElement
  }

  return node.textContent
}

export default toVNode
