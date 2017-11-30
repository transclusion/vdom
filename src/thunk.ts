// tslint:disable ban-types variable-name

import {IVElement, IVThunk} from './types'

function thunk_willDiff(a: IVThunk, b: IVThunk): IVThunk {
  if (!a || !a.args || a.fn !== b.fn || a.args.length !== b.args.length) {
    const vElement: IVElement = b.fn.apply(undefined, b.args)

    return Object.assign(b, vElement) as IVThunk
  }

  let i: number

  for (i = 0; i < b.args.length; i += 1) {
    if (a.args[i] !== b.args[i]) {
      const vElement: IVElement = b.fn.apply(undefined, b.args)

      return Object.assign(b, vElement) as IVThunk
    }
  }

  return Object.assign(b, a) as IVThunk
}

export function thunk(fn: Function, ...args: any[]): IVThunk {
  return {
    args,
    children: [],
    data: {hook: {willDiff: thunk_willDiff}},
    fn,
    name: '#thunk'
  }
}
