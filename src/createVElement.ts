import {IAttrs, IVElement, VNode} from './types'

export function createVElement(name: string, data?: IAttrs | null, ...children: VNode[]): IVElement {
  return {
    children: children
      .reduce((arr: VNode[], c: VNode) => (Array.isArray(c) ? arr.concat(c) : arr.concat([c])), [])
      .filter((c: VNode) => c !== null && c !== undefined && (typeof c !== 'boolean' || Boolean(c) !== false)),
    data: data === null ? undefined : data,
    name
  }
}
