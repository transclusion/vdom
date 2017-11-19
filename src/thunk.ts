// tslint:disable ban-types variable-name

import {IVElement, IVThunk} from './types'

const basicObjectAssign = (to: any, from: any) => {
  Object.keys(from).forEach(key => {
    to[key] = from[key]
  })

  return to
}

const thunk_willDiff = (a: IVThunk, b: IVThunk): IVThunk => {
  if (!a || !a.args || a.fn !== b.fn || a.args.length !== b.args.length) {
    const vElement: IVElement = b.fn.apply(undefined, b.args)

    return basicObjectAssign(b, vElement) as IVThunk
  }

  let i: number

  for (i = 0; i < b.args.length; i += 1) {
    if (a.args[i] !== b.args[i]) {
      const vElement: IVElement = b.fn.apply(undefined, b.args)

      return basicObjectAssign(b, vElement) as IVThunk
    }
  }

  return basicObjectAssign(b, a) as IVThunk
}

export const thunk = (fn: Function, ...args: any[]): IVThunk => ({
  args,
  children: [],
  data: {hook: {willDiff: thunk_willDiff}},
  fn,
  name: '#thunk'
})
