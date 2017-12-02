export type StyleProp = 'border'

export type EventValue = any

export interface IEventValues {
  [key: string]: EventValue
}

export type EventHandler = (eventValue: EventValue, event: Event) => void

export type HookKey = 'willDiff' | 'didInsert' | 'didUpdate' | 'didRemove'

export interface IHooks {
  didInsert?: object | string | number | null
  didRemove?: object | string | number | null
  didUpdate?: object | string | number | null
  willDiff?: (...args: any[]) => void
}

export type HookHandler = (elm: Element, value: any) => void

export interface IStyles {
  border: string
}

export interface IAttrs {
  class?: string
  hook?: IHooks
  id?: string
  innerHTML?: string
  on?: IEventValues
  style?: IStyles | string
  [key: string]: any
}

export type VText = string

export interface IVElement {
  children: Array<IVElement | VText>
  data?: IAttrs
  name: string
}

export interface IVThunk extends IVElement {
  args: any[]
  // tslint:disable-next-line ban-types
  fn: Function
}

export type VNode = IVElement | IVThunk | VText

export type PushNodePatch = [0, number]
export type PopNodePatch = [1, number]
export type InsertPatch = [2, VNode]
export type ReplacePatch = [3, VNode]
export type RemovePatch = [4, number]
export type SetAttrPatch = [5, string, any]
export type RemoveAttrPatch = [6, string]
export type SetTextPatch = [7, string]
export type DidInsertPatch = [8, any]
export type DidUpdatePatch = [9, any]
export type DidRemovePatch = [10, any]
export type Patch =
  | PushNodePatch
  | PopNodePatch
  | InsertPatch
  | ReplacePatch
  | RemovePatch
  | SetAttrPatch
  | RemoveAttrPatch
  | SetTextPatch
  | DidInsertPatch
  | DidUpdatePatch
  | DidRemovePatch
