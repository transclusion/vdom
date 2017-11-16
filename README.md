# @transclusion/vdom

A JavaScript virtual DOM library from the browser and Node.js.

```sh
npm install @transclusion/vdom --save
```

[![build status](https://img.shields.io/travis/transclusion/vdom/master.svg?style=flat-square)](https://travis-ci.org/transclusion/vdom)
[![npm version](https://img.shields.io/npm/v/@transclusion/vdom.svg?style=flat-square)](https://www.npmjs.com/package/@transclusion/vdom)

## Features

* **Serializable diffs**. Allows splitting application logic between the main thread and a worker thread.
* **Modular.** Use only what you need. Provides building blocks for your own opinionated view library.
* **Pure.** Leave side-effects in handler functions, not in the application logic.
* **Fast**. Blazing fast rendering times.
* **Light**. Weighs in at 2.5 KB minified+gzipped.
* **Use JSX.** Comes with a JSX-compatible pragma function out of the box which works with Babel and TypeScript.
* **Typed.** Written in TypeScript.

## Usage

```js
/** @jsx createVElement */

import {createVElement, diff, patch, toVNode} from '@transclusion/vdom'

const view = model => (
  <div id="root">
    <button>-</button>
    <span>{model.count}</span>
    <button>+</button>
  </div>
)

const update = (model, msg) => {
  switch (msg.type) {
    case 'DECR': return {count: model.count - 1}
    case 'INCR': return {count: model.count + 1}
    default: return model
  }
}

const handleEvent = context => (eventType, event, eventValue) => {
  context.model = update(context.model, eventValue)
  render()
}

const render = (context) => {
  const nextVNode = view(context.model)
  const patches = diff(context.vNode, nextVNode)

  patch(rootElm, patches, handleEvent(context))
  context.vNode = nextVNode
}

const rootElm = document.getElementById('root')

const context = {
  element: rootElm,
  vNode: toVNode(rootElm),
  model: {count: 0}
}

render()
```
