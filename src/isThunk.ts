import {VNode} from './types'

export function isThunk(x: VNode) {
  return typeof x === 'object' && x.name === '#thunk' && typeof (x as any).fn === 'function'
}
