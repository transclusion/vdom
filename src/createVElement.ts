import {thunk} from './thunk'
import {IAttrs, IVElement, VNode} from './types'

type Component = (...args: any[]) => VNode | null

export function createVElement(name: string | Component, data?: IAttrs | null, ...children: VNode[]): IVElement {
  if (typeof name === 'function') {
    return thunk(name, {...(data || {}), children})
  }

  return {
    children: children
      .reduce((arr: VNode[], c: VNode) => (Array.isArray(c) ? arr.concat(c) : arr.concat([c])), [])
      .filter((c: VNode) => c !== null && c !== undefined && (typeof c !== 'boolean' || Boolean(c) !== false)),
    data: data === null ? undefined : data,
    name
  }
}
