import {AttrKey, IAttrs, VNode} from './types'

export const toVNode = (node: Node) => {
  if (node.nodeType === 1) {
    const name: string = node.nodeName.toLowerCase()
    const children: VNode[] = Array.from(node.childNodes).map(toVNode)
    const data: IAttrs | null = node.attributes.length
      ? Array.from(node.attributes).reduce((a: IAttrs, attr: Attr) => {
          a[attr.name as AttrKey] = attr.value

          return a
        }, {})
      : undefined

    return {
      children,
      data,
      name
    }
  }

  return node.textContent || ''
}
