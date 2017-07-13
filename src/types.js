// @flow

export type Attrs = {
  [key: string]: any
}

export type Style = {
  [prop: string]: string | number
}

export type VText = string | number

export type VElement = {
  type: string,
  attrs: Attrs,
  children: (VElement | VText)[]
}

export type VNode = VElement | VText

export type InsertPatch = {
  type: 'INSERT',
  vNode: VNode,
  index: number
}

export type ReplacePatch = {
  type: 'REPLACE',
  vNode: VNode,
  index: number
}

export type RemovePatch = {
  type: 'REMOVE',
  vNode: VNode,
  index: number
}

export type SetPropPatch = {
  type: 'SET_PROP',
  key: string,
  value: string | Style,
  index: number
}

export type RemovePropPatch = {
  type: 'REMOVE_PROP',
  key: string,
  index: number
}

export type Patch =
  | InsertPatch
  | ReplacePatch
  | RemovePatch
  | SetPropPatch
  | RemovePropPatch
