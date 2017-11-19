# @transclusion/vdom

A JavaScript virtual DOM library for the browser and Node.js.

```sh
npm install @transclusion/vdom --save
```

[![build status](https://img.shields.io/travis/transclusion/vdom/master.svg?style=flat-square)](https://travis-ci.org/transclusion/vdom)
[![coverage status](https://img.shields.io/coveralls/transclusion/vdom/master.svg?style=flat-square)](https://coveralls.io/github/transclusion/vdom?branch=master)
[![npm version](https://img.shields.io/npm/v/@transclusion/vdom.svg?style=flat-square)](https://www.npmjs.com/package/@transclusion/vdom)

## Features

* **Serializable diffs**. Allows splitting application logic between the main thread and a worker thread.
* **Modular.** Use only what you need. Provides building blocks for your own opinionated view library.
* **Pure.** Handle side-effects in handler functions, not in the application logic.
* **Fast**. Blazing fast rendering times.
* **Light**. Weighs in at 2.5 KB minified+gzipped.
* **Use JSX.** Comes with a JSX-compatible pragma function out of the box which works with Babel and TypeScript.
* **Typed.** Written in TypeScript.

## Usage

A basic counter example:

```js
/** @jsx createVElement */

import {createVElement, diff, patch, toVNode} from '@transclusion/vdom'

const rootElm = document.getElementById('root')

const context = {
  element: rootElm,
  vNode: toVNode(rootElm),
  model: 0
}

const update = (model, msg) => {
  switch (msg) {
    case 'DECR':
      return model - 1
    case 'INCR':
      return model + 1
    default:
      return model
  }
}

const view = model => (
  <div id="root">
    <button on={{click: 'DECR'}}>-</button>
    <span>{model}</span>
    <button on={{click: 'INCR'}}>+</button>
  </div>
)

const handleEvent = (eventType, event, eventValue) => {
  context.model = update(context.model, eventValue)
  render()
}

const render = () => {
  const nextVNode = view(context.model)
  const patches = diff(context.vNode, nextVNode)

  content.element = patch(content.element, patches, handleEvent)
  context.vNode = nextVNode
}

// Start render cycle
render()
```
