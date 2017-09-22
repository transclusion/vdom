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
* **Worker-optimized.** Leave application logic to a web worker, and DOM stuff to the main thread.
* **Pure.** Leave side-effects in handler functions, not in the application logic.
* **Fast**. Blazing fast rendering times.
* **Light**. Weighs in at 2.5 KB minified+gzipped.
* **Use JSX.** Comes with a JSX pragma function out-of-the-box which works with Babel and TypeScript.
* **Types.** Written in TypeScript.
