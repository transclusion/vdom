import {HookKey, IVElement} from './types'

import {hasHook} from './hasHook'

export function callHook(vElement: IVElement, key: HookKey, ...args: any[]) {
  if (hasHook(vElement, key) && key === 'willDiff') {
    vElement.data.hook[key](...args)
  }
}
