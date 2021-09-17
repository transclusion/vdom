import {expand} from './expand'
import {IVElement, IVThunk, ThunkFunction} from './types'

function thunk_willDiff(a: IVThunk, b: IVThunk): IVThunk {
  if (!a || !a.args || a.fn !== b.fn || a.args.length !== b.args.length) {
    const vElement: IVElement = expand(b) as IVElement

    return Object.assign(b, vElement) as IVThunk
  }

  let i: number

  for (i = 0; i < b.args.length; i += 1) {
    if (a.args[i] !== b.args[i]) {
      const vElement: IVElement = expand(b) as IVElement

      return Object.assign(b, vElement) as IVThunk
    }
  }

  return Object.assign(b, a) as IVThunk
}

export function thunk(fn: ThunkFunction, ...args: any[]): IVThunk {
  return {
    args,
    children: [],
    data: {hook: {willDiff: thunk_willDiff}},
    fn,
    name: '#thunk',
  }
}
