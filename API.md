# API of `@transclusion/vdom`

## Methods

### `createVElement(name, data, ...children)`

Create a virtual DOM element.

> NOTE: `createVElement` is compatible with the JSX pragma function in Babel/Typescript.

```js
/** @jsx createVElement */

import {createVElement} from '@transclusion/vdom'

const vNode = <div class="app">Hello, world</div>
```

### `diff(fromVNode, toVNode)`

Create an array of patches to reconcile an old DOM node with a new DOM node.

### `mount(domNode, vNode, handleEvent, handleHook)`

Setup event and hook handlers on a real DOM node.

### `patch(domNode, patches, handleEvent, handleHook)`

Patch a real DOM node with virtual DOM patches.

### `thunk(renderFn, ...args)`

Create a virtual DOM node which only re-renders when the arguments have changed. Useful for optimizing rendering when
using immutable data structure.

### `toHTML(vNode)`

Create an HTML string representation of a virtual DOM node.

### `toVNode(domNode)`

Create a virtual DOM node from a real DOM node.

## Events

All DOM events are supported. Event handlers are added to the actual DOM nodes.

Unlike other virtual dom libraries, `@transclusion/vdom` uses event values instead of event callback functions. A single
function handles all events, and that function is passed to both the `mount` and `patch` functions.

### Example of using event handlers

```js
function handleEvent(eventType, event, eventValue) {
  console.log(eventValue) // -> {type: 'INCR'}
}

const oldVNode = <button />
const newVNode = <button on={{click: {type: 'INCR'}}}>+</button>

patch(element, diff(oldVNode, newVNode), handleEvent)
```

## Hooks

| Name        | Allowed value type(s)                     | Description                                                                                 |
| ----------- | ----------------------------------------- | ------------------------------------------------------------------------------------------- |
| `willDiff`  | `Function`                                | Triggers before the virtual node is diffed. This is mainly used for things such as `thunk`. |
| `didInsert` | `Object`, `String`, `Boolean` or `Number` | Triggers when a DOM element was inserted.                                                   |
| `didUpdate` | `Object`, `String`, `Boolean` or `Number` | Triggers when a DOM element was updated.                                                    |
| `didRemove` | `Object`, `String`, `Boolean` or `Number` | Triggers when a DOM element was removed.                                                    |

### Example of using hook handlers

```js
function handleHook(element, hookValue) {
  console.log(hookValue) // -> {type: 'INSERT'}
}

const oldVNode = <div />
const newVNode = (
  <div>
    <h1 hook={{didInsert: {type: 'INSERT'}}}>My app</h1>
  </div>
)

patch(element, diff(oldVNode, newVNode), null, handleHook)
```
