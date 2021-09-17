import {callWillDiffHook} from './callWillDiffHook'
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
import {extractVNode} from './extractVNode'
import {hasHook} from './hasHook'
import {isThunk} from './isThunk'
import {isVElement} from './isVElement'
import {isVText} from './isVText'
import {toHTML} from './toHTML'
import {IAttrs, IVElement, IVThunk, Patch, VNode} from './types'

function diffListeners(a: IAttrs, b: IAttrs, patches: Patch[]) {
  const aEventValues = a.on
  const bEventValues = b.on

  if (aEventValues === bEventValues) {
    return false
  }

  const aListenerKeys = aEventValues ? Object.keys(aEventValues) : []
  const bListenerKeys = bEventValues ? Object.keys(bEventValues) : []

  if (aListenerKeys.length !== bListenerKeys.length) {
    patches.push([SET_ATTR, 'on', bEventValues])

    return true
  } else {
    const keys = aListenerKeys.filter((k) => bListenerKeys.indexOf(k) > -1)

    let isDifferent = false

    keys.forEach((k) => {
      if ((aEventValues || {})[k] !== (bEventValues || {})[k]) {
        isDifferent = true
      }
    })

    if (isDifferent) {
      patches.push([SET_ATTR, 'on', bEventValues])

      return true
    }
  }

  return false
}

function diffData(a: IAttrs | undefined, b: IAttrs | undefined, patches: Patch[]) {
  let didUpdate = false

  if (b) {
    // Diff added/updated attributes
    Object.keys(b).forEach((attr) => {
      if (!a) {
        patches.push([SET_ATTR, attr, b[attr]])
      } else if (attr === 'on') {
        if (diffListeners(a, b, patches)) {
          didUpdate = true
        }
      } else if (attr !== 'hook' && a[attr] !== b[attr]) {
        patches.push([SET_ATTR, attr, b[attr]])
        didUpdate = true
      }
    })
  }

  if (a) {
    // Diff removed attributes
    Object.keys(a).forEach((attr) => {
      if (!b || b[attr] === undefined) {
        patches.push([REMOVE_ATTR, attr])
        didUpdate = true
      }
    })
  }

  return didUpdate
}

function diffChildren(a: IVElement, b: IVElement, patches: Patch[]) {
  const len: number = Math.max(a.children.length, b.children.length)

  let i: number
  let removed = 0
  let didUpdate = false

  for (i = 0; i < len; i++) {
    const index: number = i - removed

    if (a.children[i] === undefined) {
      if (isVElement(b.children[i])) {
        callWillDiffHook(b.children[i] as IVElement, a.children[i], b.children[i])
      }

      patches.push([INSERT, extractVNode(b.children[i])])

      if (isVElement(b.children[i]) && hasHook(b.children[i] as IVElement, 'didInsert')) {
        patches.push([PUSH_NODE, index])
        patches.push([DID_INSERT, (b.children[i] as IVElement).data?.hook?.didInsert])
        patches.push([POP_NODE, 1])
      }

      didUpdate = true
    } else if (b.children[i] === undefined) {
      patches.push([REMOVE, index])

      if (isVElement(a.children[i]) && hasHook(a.children[i] as IVElement, 'didRemove')) {
        patches.push([DID_REMOVE, (a.children[i] as IVElement).data?.hook?.didRemove])
      }

      didUpdate = true
      removed += 1
    } else {
      const childPatches: Patch[] = []

      diffVNode(a.children[i], b.children[i], childPatches)

      if (childPatches.length) {
        let pHead = childPatches[0]

        if (pHead[0] === PUSH_NODE) {
          // If the first child patch is a PUSH_NODE patch, then insert the index
          const h = pHead as any

          h.splice(1, 0, index)
        } else {
          // Otherwise add a new PUSH_NODE patch
          patches.push([PUSH_NODE, index])
        }

        // Append child patches
        patches.push(...childPatches)

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

  return didUpdate
}

function diffVNode(a: VNode, b: VNode, patches: Patch[]) {
  if (a === b) {
    return
  }

  let didInsert = false
  let didUpdate = false

  if (isVElement(a) && isVElement(b)) {
    const bVElement = b as IVElement

    callWillDiffHook(bVElement, a, b)

    const aVElement = a as IVElement
    let aData = aVElement.data
    const bData = bVElement.data

    if ((!aData || aData.innerHTML === undefined) && bVElement.data && bData?.innerHTML !== undefined) {
      const innerHTML: string = aVElement.children.map(toHTML).join('')

      aVElement.data = aData = aData ? {...aData, innerHTML} : {innerHTML}
      aVElement.children = []
    }

    if (aVElement.name === bVElement.name) {
      if (!hasHook(a as IVElement, 'didInsert') && hasHook(bVElement, 'didInsert')) {
        patches.push([DID_INSERT, bData?.hook?.didInsert])
        didInsert = true
      }

      if (diffData(aData, bData, patches)) {
        didUpdate = true
      }

      if (diffChildren(aVElement, bVElement, patches)) {
        didUpdate = true
      }
    } else {
      patches.push([REPLACE, extractVNode(b)])

      didInsert = true

      if (hasHook(bVElement, 'didInsert')) {
        patches.push([DID_INSERT, bData?.hook?.didInsert])
      }
    }

    if (!didInsert && didUpdate && bData && bData.hook && bData.hook.didUpdate) {
      patches.push([DID_UPDATE, bData.hook.didUpdate])
    }
  } else if (isVText(a) && isVText(b)) {
    patches.push([SET_TEXT, b as string])
  } else if (a !== b) {
    if (isThunk(b)) {
      // Resolve thunk
      const t = b as IVThunk
      const vElement = t.fn.apply(undefined, t.args)

      Object.assign(b, vElement)
    }

    patches.push([REPLACE, extractVNode(b)])
  }
}

export function diff(a: VNode, b: VNode): Patch[] {
  const patches: Patch[] = []

  diffVNode(a, b, patches)

  let len = patches.length

  if (len) {
    while (patches[len - 1][0] === POP_NODE) {
      patches.pop()
      len -= 1
    }
  }

  return patches
}
