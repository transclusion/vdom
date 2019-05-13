import {isThunk} from './isThunk'
import {IVThunk, VNode} from './types'

export function expand(vNode: VNode): VNode {
  if (isThunk(vNode)) {
    let t = vNode as IVThunk

    while (t && t.name === '#thunk') {
      t = t.fn(...t.args)

      if (typeof t !== 'object') {
        return t
      }
    }

    return {name: t.name, data: t.data, children: t.children.map(expand)}
  }

  return vNode
}
