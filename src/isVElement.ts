import {VNode} from './types'

export function isVElement(x: VNode): boolean {
  return typeof x === 'object' && typeof x.name === 'string'
}
