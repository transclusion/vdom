// @flow

import type {Patch, VElement, VNode} from './types'

import getDescendantCount from './getDescendantCount'

type DiffContext = {
  index: number,
  parentIndex: number,
  removed: number
}

const diffProps = (a: VElement, b: VElement, ctx: DiffContext) => {
  const patches = []
  const aProps = Object.keys(a.attrs)
  const bProps = Object.keys(b.attrs)

  aProps.filter(prop => prop !== 'on').forEach(prop => {
    if (!b.attrs.hasOwnProperty(prop)) {
      patches.push({
        type: 'REMOVE_PROP',
        key: prop,
        index: ctx.index
      })
    }
  })

  bProps.filter(prop => prop !== 'on').forEach(prop => {
    // TODO: check if this hack actually works in all cases:
    if (prop === 'innerHTML' && typeof a.attrs.innerHTML === 'undefined') {
      a.attrs.innerHTML = a.children[0]
      a.children = []
    }

    if (a.attrs[prop] !== b.attrs[prop]) {
      patches.push({
        type: 'SET_PROP',
        key: prop,
        value: b.attrs[prop],
        index: ctx.index
      })
    }
  })

  return patches
}

const diffChildren = (a: VElement, b: VElement, ctx: DiffContext): Patch[] => {
  const len = Math.max(a.children.length, b.children.length)

  let offset = 0
  let removed = 0
  let patches = []
  let i

  for (i = 0; i < len; i += 1) {
    const _a = a.children[i]
    const _b = b.children[i]

    const childContext = {
      index: ctx.index + offset + 1 + i - removed,
      parentIndex: ctx.index,
      removed: 0
    }

    patches = patches.concat(diff(_a, _b, childContext))

    removed += childContext.removed

    offset += getDescendantCount(_a)
  }

  ctx.index -= removed

  return patches
}

const diff = (
  a: VNode,
  b: VNode,
  ctx: DiffContext = {index: 0, removed: 0, parentIndex: 0}
): Patch[] => {
  if (a === b) {
    return []
  }

  if (typeof b === 'undefined') {
    ctx.removed += 1 + getDescendantCount(a)
    return [{type: 'REMOVE', vNode: a, index: ctx.index}]
  } else if (typeof a === 'object' && typeof b === 'object') {
    let patches = []

    if (a.type === b.type) {
      return patches
        .concat(diffProps(a, b, ctx))
        .concat(diffChildren(a, b, ctx))
    }

    const result = [{type: 'REPLACE', vNode: b, index: ctx.index}]

    ctx.removed += getDescendantCount(a) - getDescendantCount(b)

    return result
  } else if (typeof a !== 'undefined') {
    const result = [{type: 'REPLACE', vNode: b, index: ctx.index}]

    ctx.removed += getDescendantCount(a) - getDescendantCount(b)

    return result
  }

  return [{type: 'INSERT', vNode: b, index: ctx.parentIndex}]
}

export default diff
