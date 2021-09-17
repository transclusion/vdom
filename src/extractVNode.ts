import {isVElement} from './isVElement'
import {IVElement, VNode} from './types'

export function extractVNode(x: VNode): VNode {
  return isVElement(x) && (x as any).fn
    ? {
        children: (x as IVElement).children,
        data: (x as IVElement).data,
        name: (x as IVElement).name,
      }
    : (x as VNode)
}
