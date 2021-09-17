import {thunk} from './thunk'
import {IAttrs, IVElement, VNode} from './types'
import {ThunkFunction} from '.'

type Component = (...args: any[]) => VNode | null

export function createVElement(name: string | Component, data?: IAttrs | null, ...inputChildren: VNode[]): IVElement {
  const children = inputChildren
    .reduce((arr: VNode[], c: VNode) => (Array.isArray(c) ? arr.concat(c) : arr.concat([c])), [])
    .filter((c: VNode) => c !== null && c !== undefined && (typeof c !== 'boolean' || Boolean(c) !== false))

  if (typeof name === 'function') {
    return thunk(name as ThunkFunction, {...(data || {}), children})
  }

  return {
    children,
    data: !data ? undefined : data,
    name,
  }
}
