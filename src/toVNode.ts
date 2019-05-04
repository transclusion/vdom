import {IAttrs, VNode} from './types'

export function toVNode(node: Node) {
  if (node.nodeType === 1) {
    const name: string = node.nodeName.toLowerCase()
    const children: VNode[] = Array.from(node.childNodes).map(toVNode)
    const data: IAttrs | null = (node as Element).attributes.length
      ? Array.from((node as Element).attributes).reduce((a: IAttrs, attr: Attr) => {
          a[attr.name] = attr.value

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
