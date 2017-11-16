export type StyleProp = 'border'

export type Listener = any

export type ListenerKey = 'click'

export interface IListeners {
  click?: Listener
}

export type EventType = 'click'

export type EventHandler = (eventType: EventType, event: Event, listener: Listener) => void

export type HookKey = 'willDiff' | 'didInsert' | 'didUpdate' | 'didRemove'

export interface IHooks {
  didInsert?: any
  didRemove?: any
  didUpdate?: any
  willDiff?: any
}

export type HookHandler = (elm: Element, value: any) => void

export type AttrKey = 'hook' | 'id' | 'innerHTML' | 'on' | 'style'

export interface IStyles {
  border: string
}

export interface IAttrs {
  hook?: IHooks
  id?: string
  innerHTML?: string
  on?: IListeners
  style?: IStyles | string
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
export type SetAttrPatch = [5, AttrKey, any]
export type RemoveAttrPatch = [6, AttrKey]
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
