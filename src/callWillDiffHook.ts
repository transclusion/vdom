import {hasHook} from './hasHook'
import {IVElement} from './types'

export function callWillDiffHook(vElement: IVElement, ...args: any[]): void {
  if (hasHook(vElement, 'willDiff')) {
    const willDiff = vElement.data?.hook?.willDiff

    if (willDiff) willDiff(...args)
  }
}
