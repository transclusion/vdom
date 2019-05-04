import {IVElement} from './types'

import {hasHook} from './hasHook'

export function callWillDiffHook(vElement: IVElement, ...args: any[]) {
  if (hasHook(vElement, 'willDiff')) {
    vElement.data.hook.willDiff(...args)
  }
}
