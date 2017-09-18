// tslint:disable ban-types no-any variable-name

import {IVElement, IVThunk} from './types'

const thunk_willDiff = (a: IVThunk, b: IVThunk): IVThunk => {
  if (!a || !a.args || a.fn !== b.fn || a.args.length !== b.args.length) {
    const vElement: IVElement = b.fn.apply(undefined, b.args)

    return Object.assign(b, vElement)
  }

  let i: number

  for (i = 0; i < b.args.length; i += 1) {
    if (a.args[i] !== b.args[i]) {
      const vElement: IVElement = b.fn.apply(undefined, b.args)

      return Object.assign(b, vElement)
    }
  }

  return Object.assign(b, a)
}

export const thunk = (fn: Function, ...args: any[]): IVThunk => ({
  args,
  children: [],
  data: {hook: {willDiff: thunk_willDiff}},
  fn,
  name: '#thunk'
})
