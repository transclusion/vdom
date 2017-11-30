import {HookKey, IVElement} from './types'

export function hasHook(vElement: IVElement, key: HookKey) {
  return vElement.data && vElement.data.hook && Boolean(vElement.data.hook[key])
}
