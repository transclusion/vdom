import {addListeners} from './addListeners'
import {isVElement} from './isVElement'
import {EventHandler, IVElement, VNode} from './types'

export function mount(node: Node, vNode: VNode, handleEvent?: EventHandler): void {
  if (isVElement(vNode)) {
    const vElement: IVElement = vNode as IVElement

    if (node instanceof Element) {
      const data = vElement.data

      if (data && data.on && handleEvent) {
        addListeners(node, data.on, handleEvent)
      }

      vElement.children.forEach((c: VNode, idx: number) => {
        mount(node.childNodes[idx], c, handleEvent)
      })
    }
  }
}
