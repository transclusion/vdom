import {IVElement, VNode} from './types'

import {isVElement} from './isVElement'

export function extractVNode(x: VNode): VNode {
  return isVElement(x) && (x as any).fn
    ? {
        children: (x as IVElement).children,
        data: (x as IVElement).data,
        name: (x as IVElement).name
      }
    : (x as VNode)
}
