import {VIRTUAL_ATTRS} from './constants'
import {AttrKey, EventHandler, IAttrs, IStyles, StyleProp, VNode} from './types'

import {addListeners} from './addListeners'

function setAttributes(element: HTMLElement | SVGElement, data: IAttrs) {
  Object.keys(data)
    .filter((attr: AttrKey) => data[attr] !== undefined && attr !== 'innerHTML' && VIRTUAL_ATTRS.indexOf(attr) === -1)
    .forEach((attr: AttrKey) => {
      if (attr === 'style' && typeof data.style === 'object') {
        Object.keys(data[attr]).forEach((styleProp: StyleProp) => {
          element.style[styleProp] = (data.style as IStyles)[styleProp]
        })
      } else if (attr !== 'hook' && attr !== 'on') {
        if (typeof data[attr] === 'string') {
          element.setAttribute(attr, String(data[attr]))
        } else if (typeof data[attr] === 'boolean' && Boolean(data[attr]) === true) {
          element.setAttribute(attr, '')
        } else if (typeof data[attr] !== 'boolean') {
          element.setAttribute(attr, String(data[attr]))
        }
      }
    })
}

function createSVGNode(vNode: VNode, handleEvent?: EventHandler | null) {
  if (typeof vNode !== 'object') {
    return document.createTextNode(vNode)
  }

  const element = document.createElementNS('http://www.w3.org/2000/svg', vNode.name)

  const data: IAttrs | undefined = vNode.data

  if (data) {
    setAttributes(element, data)
    if (handleEvent && data.on) {
      addListeners(element, data.on, handleEvent)
    }
  }

  if (!data || data.innerHTML === undefined) {
    vNode.children.forEach((c: VNode) => element.appendChild(createSVGNode(c, handleEvent)))
  } else {
    element.innerHTML = data.innerHTML
  }

  return element
}

export function createNode(vNode: VNode, handleEvent?: EventHandler | null) {
  if (typeof vNode !== 'object') {
    return document.createTextNode(vNode)
  }

  if (vNode.name === 'svg') {
    return createSVGNode(vNode, handleEvent)
  }

  const element: HTMLElement = document.createElement(vNode.name)
  const data: IAttrs = vNode.data

  if (data) {
    setAttributes(element, data)
    if (handleEvent && data.on) {
      addListeners(element, data.on, handleEvent)
    }
  }

  if (!data || data.innerHTML === undefined) {
    vNode.children.forEach((c: VNode) => element.appendChild(createNode(c, handleEvent)))
  } else {
    element.innerHTML = data.innerHTML
  }

  return element
}
