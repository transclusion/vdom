// @flow

import type {Patch} from './types'

import createNodeFromVNode from './createNodeFromVNode'
import getNodeAtIndex from './getNodeAtIndex'

const patch = (element: Node, patches: Patch[], handleMsg: Function | null) => {
  patches.forEach(p => {
    const index = p.index

    switch (p.type) {
      case 'INSERT': {
        const node = createNodeFromVNode(p.vNode, handleMsg)
        const parentNode = getNodeAtIndex(element, index)

        if (parentNode) parentNode.appendChild(node)

        break
      }

      case 'REPLACE': {
        const prevNode = getNodeAtIndex(element, index)

        if (!prevNode) {
          throw new Error('Replacing a nonexistent node')
        }

        const parentNode = prevNode.parentNode

        if (parentNode) {
          const node = createNodeFromVNode(p.vNode, handleMsg)

          parentNode.insertBefore(node, prevNode)
          parentNode.removeChild(prevNode)
        }
        break
      }

      case 'REMOVE': {
        const node = getNodeAtIndex(element, index)

        if (node && node.parentNode) node.parentNode.removeChild(node)

        break
      }

      case 'REMOVE_PROP': {
        const node: any = getNodeAtIndex(element, index)

        if (node) node.removeAttribute(p.key)

        break
      }

      case 'SET_PROP': {
        const node: any = getNodeAtIndex(element, index)

        if (node) node.setAttribute(p.key, p.value)

        break
      }

      default:
        console.error(`Unknown patch: ${p.type}`)
    }
  })
}

export default patch
