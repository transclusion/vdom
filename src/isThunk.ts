import {VNode} from './types'

export function isThunk(x: VNode): boolean {
  return typeof x === 'object' && x.name === '#thunk' && typeof (x as any).fn === 'function'
}
