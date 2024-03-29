import {addListeners} from './addListeners'
import {
  DID_INSERT,
  DID_REMOVE,
  DID_UPDATE,
  INSERT,
  POP_NODE,
  PUSH_NODE,
  REMOVE,
  REMOVE_ATTR,
  REPLACE,
  SET_ATTR,
  SET_TEXT,
} from './constants'

import {createNode} from './createNode'
import {EventHandler, HookHandler, Patch, StyleProp} from './types'

export function patch(
  element: Element,
  patches: Patch[],
  handleEvent?: EventHandler | null,
  handleHook?: HookHandler
): Element {
  const len: number = patches.length
  const nodeStack: Node[] = [element]
  const didInsertHookArgs = []
  const didUpdateHookArgs = []
  const didRemoveHookArgs = []

  let node: Node = element
  let i: number

  for (i = 0; i < len; i++) {
    const p: Patch = patches[i]

    switch (p[0]) {
      case PUSH_NODE: {
        let j: number

        for (j = 1; j < p.length; j++) {
          node = node.childNodes[p[j]]
          nodeStack.push(node)
        }

        break
      }

      case POP_NODE: {
        let j: number

        for (j = 0; j < p[1]; j++) {
          nodeStack.pop()
          node = nodeStack[nodeStack.length - 1]
        }

        break
      }

      case REPLACE: {
        const newNode: Node = createNode(p[1], handleEvent)

        ;(node.parentNode as Element).replaceChild(newNode, node)
        node = newNode
        nodeStack[nodeStack.length - 1] = node
        break
      }

      case SET_ATTR:
        if (p[1] === 'innerHTML') {
          const el = node as Element

          el.innerHTML = p[2]
        } else if (p[1] === 'on') {
          if (handleEvent) {
            addListeners(node as Element, p[2], handleEvent)
          }
        } else if (p[1] === 'style' && typeof p[2] === 'object') {
          Object.keys(p[2]).forEach((styleProp: StyleProp) => {
            const el = node as HTMLElement

            el.style[styleProp as any] = p[2][styleProp]
          })
        } else if (p[1] === 'value' && node.nodeName === 'INPUT') {
          const el = node as HTMLInputElement

          el.value = p[2]
        } else if (p[1] === 'value' && node.nodeName === 'TEXTAREA') {
          const el = node as HTMLTextAreaElement

          el.value = p[2]
        } else {
          if (p[2] === true) {
            const el = node as Element

            el.setAttribute(p[1], '')
          } else if (p[2] === false) {
            const el = node as Element

            el.removeAttribute(p[1])
          } else {
            const el = node as Element

            el.setAttribute(p[1], p[2])
          }
        }

        break

      case REMOVE_ATTR: {
        const el = node as Element

        el.removeAttribute(p[1])
        break
      }

      case REMOVE: {
        const el = node as Element

        el.removeChild(node.childNodes[p[1]])
        break
      }

      case INSERT: {
        const el = node as Element

        el.appendChild(createNode(p[1], handleEvent))
        break
      }

      case SET_TEXT:
        node.nodeValue = p[1]
        break

      case DID_INSERT:
        didInsertHookArgs.unshift([p[1], node])
        break

      case DID_UPDATE:
        didUpdateHookArgs.unshift([p[1], node as Element])
        break

      case DID_REMOVE:
        didRemoveHookArgs.unshift([p[1], node as Element])
        break

      default:
        throw new Error(`Unknown patch type: ${p[0]}`)
    }
  }

  if (handleHook) {
    didUpdateHookArgs.forEach((cache) => handleHook(cache[0], cache[1]))
    didInsertHookArgs.forEach((cache) => handleHook(cache[0], cache[1]))
    didRemoveHookArgs.forEach((cache) => handleHook(cache[0], cache[1]))
  }

  return element
}
