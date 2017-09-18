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
  SET_TEXT
} from './constants'
import {
  AttrKey,
  HookKey,
  IAttrs,
  IHooks,
  IListeners,
  IVElement,
  ListenerKey,
  Patch,
  VNode
} from './types'

import {callHook} from './callHook'
import {extractVNode} from './extractVNode'
import {hasHook} from './hasHook'
import {isVElement} from './isVElement'
import {isVText} from './isVText'
import {toHTML} from './toHTML'

const diffHooks = (a: IAttrs, b: IAttrs, patches: Patch[]) => {
  const aHooks: IHooks = a.hook
  const bHooks: IHooks = b.hook

  if (aHooks === bHooks) {
    return
  }

  if (!aHooks) {
    patches.push([SET_ATTR, 'hook' as AttrKey, bHooks])
    return
  }

  if (bHooks) {
    const aHookKeys = Object.keys(aHooks) as HookKey[]
    const bHookKeys = Object.keys(bHooks) as HookKey[]
    const keys = aHookKeys.filter(k => bHookKeys.indexOf(k) > -1)
    if (aHookKeys.length !== keys.length) {
      patches.push([SET_ATTR, 'hook' as AttrKey, bHooks])
    } else {
      let isDifferent = false
      keys.forEach(k => {
        if (aHooks[k] !== bHooks[k]) {
          isDifferent = true
        }
      })
      if (isDifferent) {
        patches.push([SET_ATTR, 'hook' as AttrKey, bHooks])
      }
    }
  }
}

const diffListeners = (a: IAttrs, b: IAttrs, patches: Patch[]) => {
  const aListeners: IListeners = a.on
  const bListeners: IListeners = b.on

  if (aListeners === bListeners) {
    return
  }

  if (!aListeners) {
    patches.push([SET_ATTR, 'on' as AttrKey, bListeners])
    return
  }

  if (bListeners) {
    const aListenerKeys = Object.keys(aListeners) as ListenerKey[]
    const bListenerKeys = Object.keys(bListeners) as ListenerKey[]
    const keys = aListenerKeys.filter(k => bListenerKeys.indexOf(k) > -1)
    if (aListenerKeys.length !== keys.length) {
      patches.push([SET_ATTR, 'on' as AttrKey, bListeners])
    } else {
      let isDifferent = false
      keys.forEach(k => {
        if (aListeners[k] !== bListeners[k]) {
          isDifferent = true
        }
      })
      if (isDifferent) {
        patches.push([SET_ATTR, 'on' as AttrKey, bListeners])
      }
    }
  }
}

const diffData = (
  a: IAttrs | undefined,
  b: IAttrs | undefined,
  patches: Patch[]
) => {
  if (b) {
    // Diff added/updated attributes
    Object.keys(b).forEach((attr: AttrKey) => {
      if (!a) {
        patches.push([SET_ATTR, attr, b[attr]])
      } else if (attr === 'hook') {
        diffHooks(a, b, patches)
      } else if (attr === 'on') {
        diffListeners(a, b, patches)
      } else if (a[attr] !== b[attr]) {
        patches.push([SET_ATTR, attr, b[attr]])
      }
    })
  }

  if (a) {
    // Diff removed attributes
    Object.keys(a).forEach((attr: AttrKey) => {
      if (!b || b[attr] === undefined) {
        patches.push([REMOVE_ATTR, attr])
      }
    })
  }
}

const diffChildren = (a: IVElement, b: IVElement, patches: Patch[]) => {
  const len: number = Math.max(a.children.length, b.children.length)

  let i: number
  let removed = 0
  let didUpdate = false

  for (i = 0; i < len; i++) {
    const index: number = i - removed

    if (a.children[i] === undefined) {
      if (isVElement(b.children[i])) {
        callHook(
          b.children[i] as IVElement,
          'willDiff',
          a.children[i],
          b.children[i]
        )
      }

      patches.push([INSERT, extractVNode(b.children[i])])

      didUpdate = true

      if (
        isVElement(b.children[i]) &&
        hasHook(b.children[i] as IVElement, 'didInsert')
      ) {
        patches.push([
          DID_INSERT,
          (b.children[i] as IVElement).data.hook.didInsert
        ])
      }
    } else if (b.children[i] === undefined) {
      patches.push([REMOVE, index])

      if (
        isVElement(a.children[i]) &&
        hasHook(a.children[i] as IVElement, 'didRemove')
      ) {
        patches.push([
          DID_REMOVE,
          (a.children[i] as IVElement).data.hook.didRemove
        ])
      }

      didUpdate = true
      removed += 1
    } else {
      const childPatches: Patch[] = []

      diffVNode(a.children[i], b.children[i], childPatches)

      if (childPatches.length) {
        // If the first child patch is a PUSH_NODE patch, then insert the index
        let pHead = childPatches[0]
        if (pHead[0] === PUSH_NODE) {
          // tslint:disable-next-line no-any
          ;(pHead as any).splice(1, 0, index)
        } else {
          patches.push([PUSH_NODE, index])
        }

        // Append child patches
        ;[].push.apply(patches, childPatches)

        // If the last patch is a POP_NODE patch, then increase the pop count by 1
        pHead = patches[patches.length - 1]
        if (pHead && pHead[0] === POP_NODE) {
          pHead[1] += 1
        } else {
          patches.push([POP_NODE, 1])
        }

        didUpdate = true
      }
    }
  }

  if (didUpdate && hasHook(b, 'didUpdate')) {
    patches.push([DID_UPDATE, b.data.hook.didUpdate])
  }
}

const diffVNode = (a: VNode, b: VNode, patches: Patch[]) => {
  if (a === b) {
    return
  }

  if (isVElement(a) && isVElement(b)) {
    const aVElement: IVElement = a as IVElement
    const bVElement: IVElement = b as IVElement

    if (
      (!aVElement.data || bVElement.data.innerHTML === undefined) &&
      bVElement.data &&
      bVElement.data.innerHTML !== undefined
    ) {
      const innerHTML: string = aVElement.children.map(toHTML).join('')
      aVElement.data = aVElement.data
        ? {...aVElement.data, innerHTML}
        : {innerHTML}
      aVElement.children = []
    }

    callHook(bVElement, 'willDiff', a, b)

    if (aVElement.name === bVElement.name) {
      if (
        !hasHook(a as IVElement, 'didInsert') &&
        hasHook(bVElement, 'didInsert')
      ) {
        patches.push([DID_INSERT, bVElement.data.hook.didInsert])
      }

      diffData(aVElement.data, bVElement.data, patches)
      diffChildren(aVElement, bVElement, patches)
    } else {
      patches.push([REPLACE, extractVNode(b)])

      if (hasHook(bVElement, 'didInsert')) {
        patches.push([DID_INSERT, bVElement.data.hook.didInsert])
      }
    }
  } else if (isVText(a) && isVText(b)) {
    patches.push([SET_TEXT, b as string])
  } else if (a !== b) {
    patches.push([REPLACE, extractVNode(b)])
  }
}

export const diff = (a: VNode, b: VNode) => {
  const patches: Patch[] = []

  diffVNode(a, b, patches)

  if (patches.length) {
    while (patches[patches.length - 1][0] === POP_NODE) {
      patches.pop()
    }
  }

  return patches
}
