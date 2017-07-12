// @flow

import type {VNode} from './types'

const getDescendantCount = (vNode: VNode) => {
  if (typeof vNode === 'object') {
    let count = vNode.children.length

    vNode.children.forEach(c => {
      count += getDescendantCount(c)
    })

    return count
  }

  return 0
}

export default getDescendantCount
