import {HookKey, IVElement} from './types'

export function hasHook(vElement: IVElement, key: HookKey): boolean {
  return Boolean(vElement.data && vElement.data.hook && vElement.data.hook[key])
}
