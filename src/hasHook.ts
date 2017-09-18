import {HookKey, IVElement} from './types'

export const hasHook = (vElement: IVElement, key: HookKey) =>
  vElement.data && vElement.data.hook && Boolean(vElement.data.hook[key])
