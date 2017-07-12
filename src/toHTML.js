// @flow

import type {VNode} from './types'

import renderStyle from './renderStyle'

const HIDDEN_PROPS = ['on', 'innerHTML']
const SELF_CLOSING_TAGS = ['img', 'source']

const renderAttrs = (data: Object) => {
  return Object.keys(data)
    .filter(key => HIDDEN_PROPS.indexOf(key) === -1)
    .map(key => {
      return ` ${key}="${key === 'style' ? renderStyle(data[key]) : data[key]}"`
    })
    .join('')
}

const toHTML = (vNode: VNode) => {
  if (typeof vNode === 'object') {
    let html = `<${vNode.type}${renderAttrs(vNode.attrs)}>`

    if (vNode.attrs.innerHTML) {
      html += vNode.attrs.innerHTML
    } else {
      html += vNode.children.map(toHTML).join('')
    }

    if (SELF_CLOSING_TAGS.indexOf(vNode.type) === -1) {
      html += `</${vNode.type}>`
    }

    return html
  }

  return vNode.toString()
}

export default toHTML
