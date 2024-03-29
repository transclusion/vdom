import {addListeners} from './addListeners'
import {VIRTUAL_ATTRS} from './constants'
import {EventHandler, IAttrs, IVElement, StyleProp, VNode} from './types'

function setAttributes(element: HTMLElement | SVGElement, data: IAttrs) {
  Object.keys(data)
    .filter((attr) => data[attr] !== undefined && attr !== 'innerHTML' && VIRTUAL_ATTRS.indexOf(attr) === -1)
    .forEach((attr) => {
      if (attr === 'style') {
        const style = data.style

        if (typeof style === 'object') {
          Object.keys(style).forEach((styleProp: StyleProp) => {
            element.style[styleProp as any] = style[styleProp]
          })
        } else if (typeof style === 'string') {
          element.setAttribute('style', style)
        }
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

function createSVGNode(vNode: IVElement, handleEvent?: EventHandler | null) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', vNode.name)
  const data = vNode.data

  if (data) {
    setAttributes(element, data)

    if (handleEvent && data.on) {
      addListeners(element, data.on, handleEvent)
    }
  }

  if (!data || data.innerHTML === undefined) {
    vNode.children.forEach((c: VNode) => {
      if (typeof c === 'object') {
        element.appendChild(createSVGNode(c, handleEvent))
      }
    })
  } else {
    element.innerHTML = data.innerHTML
  }

  return element
}

export function createNode(vNode: VNode, handleEvent?: EventHandler | null): Node {
  if (typeof vNode !== 'object') {
    return document.createTextNode(vNode)
  }

  if (vNode.name === 'svg') {
    return createSVGNode(vNode, handleEvent)
  }

  const element = document.createElement(vNode.name)
  const data = vNode.data

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
