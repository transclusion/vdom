import {EventHandler, IAttrs, IVElement, VNode} from './types'

import {addListeners} from './addListeners'
import {isVElement} from './isVElement'

export function mount(node: Node, vNode: VNode, handleEvent?: EventHandler) {
  if (isVElement(vNode)) {
    const vElement: IVElement = vNode as IVElement

    if (node instanceof Element) {
      const data: IAttrs = vElement.data

      if (data && data.on && handleEvent) {
        addListeners(node, data.on, handleEvent)
      }

      vElement.children.forEach((c: VNode, idx: number) => {
        mount(node.childNodes[idx], c, handleEvent)
      })
    }
  }
}
