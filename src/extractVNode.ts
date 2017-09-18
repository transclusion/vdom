import {IVElement, VNode} from './types'

import {isVElement} from './isVElement'

export const extractVNode = (x: VNode): VNode =>
  isVElement(x) && (x as any).fn
    ? {
        children: (x as IVElement).children,
        data: (x as IVElement).data,
        name: (x as IVElement).name
      }
    : x as VNode
