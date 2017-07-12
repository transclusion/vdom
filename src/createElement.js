// @flow

import type {Attrs} from './types'

export default (type: string, attrs: ?Attrs, ...children: any[]) => {
  return {
    type,
    attrs: attrs || {},
    children: children
      .filter(c => c !== null && typeof c !== 'undefined')
      .reduce((arr, c) => {
        if (Array.isArray(c)) return arr.concat(c)
        arr.push(c)
        return arr
      }, [])
  }
}
