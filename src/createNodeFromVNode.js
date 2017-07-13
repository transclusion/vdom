// @flow

import type {VNode} from './types'

import addListeners from './addListeners'
import renderStyle from './renderStyle'

const HIDDEN_PROPS = ['on', 'innerHTML']

const createNodeFromVNode = (
  vNode: VNode,
  handleMsg: Function | null
): Node => {
  if (typeof vNode === 'object') {
    const node = document.createElement(vNode.type)
    const data = vNode.attrs

    if (handleMsg && data.on) {
      addListeners(node, data.on, handleMsg)
    }

    Object.keys(data)
      .filter(key => HIDDEN_PROPS.indexOf(key) === -1)
      .forEach(prop => {
        node.setAttribute(
          prop,
          prop === 'style' ? renderStyle(data[prop]) : data[prop]
        )
      })

    if (typeof data.innerHTML === 'undefined') {
      vNode.children.forEach(child =>
        node.appendChild(createNodeFromVNode(child, handleMsg))
      )
    } else {
      node.innerHTML = data.innerHTML
    }

    return node
  }

  return document.createTextNode(vNode.toString())
}

export default createNodeFromVNode
