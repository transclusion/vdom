import {HookKey, IVElement} from './types'

import {hasHook} from './hasHook'

export const callHook = (vElement: IVElement, key: HookKey, ...args: any[]) => {
  if (hasHook(vElement, key)) {
    vElement.data.hook[key](...args)
  }
}
