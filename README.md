# @transclusion/vdom

[![Greenkeeper badge](https://badges.greenkeeper.io/transclusion/vdom.svg)](https://greenkeeper.io/)

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

## Documentation

See [API documentation](API.md).

## Usage

A basic counter example:

```js
/** @jsx createVElement */

import {createVElement, diff, patch, toVNode} from '@transclusion/vdom'

// Define `counter` component

const counter = {
  // Returns the initial model
  init() {
    return 0
  },

  // Updates the model
  update(model, msg) {
    switch (msg) {
      case 'DECR':
        return model - 1
      case 'INCR':
        return model + 1
      default:
        return model
    }
  },

  // Renders the model to a view representation (vdom)
  view(model) {
    return (
      <div id="root">
        <button on={{click: 'DECR'}}>-</button>
        <span>{model}</span>
        <button on={{click: 'INCR'}}>+</button>
      </div>
    )
  }
}

// Initialize client-side application

const rootElm = document.getElementById('root')

const context = {
  element: rootElm,
  vNode: toVNode(rootElm),
  model: counter.init()
}

function handleMsg(msg) {
  context.model = counter.update(context.model, msg)
  render()
}

function render() {
  const nextVNode = counter.view(context.model)
  const patches = diff(context.vNode, nextVNode)

  context.element = patch(context.element, patches, handleMsg)
  context.vNode = nextVNode
}

// Start render cycle
render()
```

## License

MIT © [Marius Lundgård](https://mariuslundgard.com)
