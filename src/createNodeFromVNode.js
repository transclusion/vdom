// @flow

import type {VNode} from './types'

import addListeners from './addListeners'
import renderStyle from './renderStyle'

const HIDDEN_PROPS = ['on', 'innerHTML']

const DOM_PROPS_MAP = {
  className: 'class'
}

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

    Object.keys(vNode.attrs)
      .map(prop => DOM_PROPS_MAP[prop] || prop)
      .filter(key => HIDDEN_PROPS.indexOf(key) === -1)
      .forEach(prop => {
        node.setAttribute(
          prop,
          prop === 'style' ? renderStyle(data[prop]) : data[prop]
        )
      })

    if (typeof vNode.attrs.innerHTML === 'undefined') {
      vNode.children.forEach(child =>
        node.appendChild(createNodeFromVNode(child, handleMsg))
      )
    } else {
      node.innerHTML = vNode.attrs.innerHTML
    }

    return node
  }

  return document.createTextNode(vNode.toString())
}

export default createNodeFromVNode
