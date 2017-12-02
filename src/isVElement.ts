import {VNode} from './types'

export function isVElement(x: VNode) {
  return typeof x === 'object' && typeof x.name === 'string'
}
