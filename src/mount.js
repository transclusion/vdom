// @flow

import type {VNode} from './types'

import addListeners from './addListeners'

const mount = (node: Node, vNode: VNode, handleMsg: Function) => {
  if (typeof vNode === 'object') {
    const attrs = vNode.attrs

    if (attrs.on) {
      addListeners(node, attrs.on, handleMsg)
    }

    vNode.children.forEach((c, idx) => {
      mount(node.childNodes[idx], c, handleMsg)
    })
  }
}

export default mount
