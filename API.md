# API of `@transclusion/vdom`

## Methods

### `diff(a, b)`
### `mount(node, vNode, handleEvent, handleHook)`
### `patch(node, patches, handleEvent, handleHook)`
### `toHTML(vNode)`
### `toVNode(node)`

## Hooks

| Name | Type | Description |
|-
| `willDiff` | `Function` | Triggers before the virtual node is diffed. This is mainly used for things such as `thunk`. |
| `didInsert` | `Object`, `String`, `Boolean` or `Number` | Triggers when a DOM element was inserted. |
| `didUpdate` | `Object`, `String`, `Boolean` or `Number` | Triggers when a DOM element was updated. |
| `didRemove` | `Object`, `String`, `Boolean` or `Number` | Triggers when a DOM element was removed. |

## Events

All DOM events are supported. Event handlers are added to the actual nodes (not using SyntethicEvents like in React).

Unlike other virtual dom libraries, `@transclusion/vdom` uses event values instead of event callback functions. A single function handles all events, and that function is passed to both the `mount` and `patch` functions.

```js
function handleEvent(type, event, value) {
  // handle event here...
}

const oldVNode = <button />
const newVNode = <button on={{click: {type: 'INCR'}}}>+</button>

patch(element, diff(oldVNode, newVNode), handleEvent)
```
