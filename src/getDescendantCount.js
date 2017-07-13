// @flow

import type {VNode} from './types'

const getDescendantCount = (vNode: VNode) => {
  if (typeof vNode === 'object') {
    if (typeof vNode.attrs.innerHTML !== 'undefined') {
      return 1
    }

    let count = vNode.children.length

    vNode.children.forEach(c => {
      count += getDescendantCount(c)
    })

    return count
  }

  return 0
}

export default getDescendantCount
