import {VIRTUAL_ATTRS, VOID_TAGS} from './constants'
import {isVElement} from './isVElement'
import {AttrKey, IAttrs, IStyles, IVElement, StyleProp, VNode} from './types'

function renderStyles(styles: IStyles | string) {
  if (typeof styles === 'string') {
    return styles
  }

  return Object.keys(styles)
    .map((key: StyleProp) => `${key}: ${styles[key]}`)
    .join('; ')
    .trim()
}

function renderAttrs(data?: IAttrs) {
  if (data === undefined) {
    return ''
  }

  return Object.keys(data)
    .filter(
      (key: AttrKey) =>
        data[key] !== undefined && data[key] !== false && key !== 'innerHTML' && VIRTUAL_ATTRS.indexOf(key) === -1
    )
    .map((key: AttrKey) => {
      if (typeof data[key] === 'boolean') {
        return ` ${key}`
      }

      return ` ${key}="${key === 'style' ? renderStyles(data[key] as IStyles) : data[key]}"`
    })
    .join('')
}

export function toHTML(vNode: VNode) {
  if (isVElement(vNode)) {
    const vElement: IVElement = vNode as IVElement
    const data: IAttrs | null = vElement.data

    let html: string

    html = `<${vElement.name}${renderAttrs(data)}>`

    if (data && data.innerHTML) {
      html += data.innerHTML
    } else {
      html += vElement.children.map(toHTML).join('')
    }

    if (VOID_TAGS.indexOf(vElement.name) === -1) {
      html += `</${vElement.name}>`
    }

    return html
  }

  return String(vNode)
}
