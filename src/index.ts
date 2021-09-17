import {createNode} from './createNode'
import {createVElement} from './createVElement'
import {diff} from './diff'
import {expand} from './expand'
import {mount} from './mount'
import {patch} from './patch'
import {thunk} from './thunk'
import {toHTML} from './toHTML'
import {toVNode} from './toVNode'
import type {IAttrs, IVElement, IVThunk, Patch, ThunkFunction, VNode} from './types'

// Export types
export type {IAttrs, IVElement, IVThunk, Patch, ThunkFunction, VNode}

// Export functions
export {createNode, createVElement, diff, expand, mount, patch, thunk, toHTML, toVNode}
