// @flow

/** @jsx el */

import type {Patch} from '../src/types'

import createNodeFromVNode from '../src/createNodeFromVNode'
import diff from '../src/diff'
// eslint-disable-next-line no-unused-vars
import el from '../src/createElement'
import patch from '../src/patch'

test('should remove DOM nodes', () => {
  const vNode = (
    <div>
      <span>1</span>
      <span>2</span>
    </div>
  )

  const element: any = createNodeFromVNode(vNode, () => {})

  const patches: Patch[] = [
    {type: 'REMOVE', vNode: vNode.children[0], index: 1},
    {type: 'REMOVE', vNode: vNode.children[1], index: 1}
  ]

  expect(element.outerHTML).toEqual('<div><span>1</span><span>2</span></div>')

  patch(element, patches, null)

  expect(element.outerHTML).toEqual('<div></div>')
})

test('should replace and remove DOM nodes', () => {
  const vNode = (
    <div>
      <span>1</span>
      <span>2</span>
    </div>
  )

  const element: any = createNodeFromVNode(vNode, null)

  const patches: Patch[] = [
    {type: 'REPLACE', vNode: <div>test</div>, index: 1},
    {type: 'REMOVE', vNode: vNode.children[1], index: 3}
  ]

  expect(element.outerHTML).toEqual('<div><span>1</span><span>2</span></div>')

  patch(element, patches, null)

  expect(element.outerHTML).toEqual('<div><div>test</div></div>')
})

test('should replace DOM nodes with text', () => {
  const vNode = (
    <div>
      <p>foo</p>
      <p>bar</p>
      <p>bax</p>
    </div>
  )

  const element: any = createNodeFromVNode(vNode, null)

  const patches = [
    {type: 'REPLACE', vNode: 'test', index: 1},
    {type: 'REMOVE', vNode: vNode.children[1], index: 2},
    {type: 'REMOVE', vNode: vNode.children[2], index: 2}
  ]

  patch(element, patches, null)

  expect(element.outerHTML).toEqual('<div>test</div>')
})

test('---', () => {
  const vNode0 = (
    <div class="app">
      {'Not found: '}
      {'/'}
    </div>
  )
  const vNode1 = (
    <div class="app">
      <div />
      <nav>
        <ul>
          <li>
            <a href="/">foo</a>
          </li>
          <li>
            <a href="/">bar</a>
          </li>
          <li>
            <a href="/">baz</a>
          </li>
        </ul>
      </nav>
      <div class="screen isLoading">Loading...</div>
    </div>
  )
  const vNode2 = (
    <div class="app">
      <div />
      <nav>
        <ul>
          <li>
            <a href="/">foo</a>
          </li>
          <li>
            <a href="/">bar</a>
          </li>
          <li>
            <a href="/">baz</a>
          </li>
        </ul>
      </nav>
      <article class="screen">
        <h1>test</h1>
        <div>
          <ul>
            <li>
              <a href="/">foo</a>
            </li>
            <li>
              <a href="/">bar</a>
            </li>
            <li>
              <a href="/">baz</a>
            </li>
          </ul>
        </div>
      </article>
    </div>
  )

  const element: any = createNodeFromVNode(vNode0, null)

  expect(element.outerHTML).toEqual('<div class="app">Not found: /</div>')

  const patches0 = diff(vNode0, vNode1)

  patch(element, patches0, null)

  expect(element.outerHTML).toEqual(
    '<div class="app"><div></div><nav><ul><li><a href="/">foo</a></li><li><a href="/">bar</a></li><li><a href="/">baz</a></li></ul></nav><div class="screen isLoading">Loading...</div></div>'
  )

  const patches1 = diff(vNode1, vNode2)

  patch(element, patches1, null)

  expect(element.outerHTML).toEqual(
    '<div class="app"><div></div><nav><ul><li><a href="/">foo</a></li><li><a href="/">bar</a></li><li><a href="/">baz</a></li></ul></nav><article class="screen"><h1>test</h1><div><ul><li><a href="/">foo</a></li><li><a href="/">bar</a></li><li><a href="/">baz</a></li></ul></div></article></div>'
  )
})

test('patch nested attribute in tree with multiple innerHTML attributes', () => {
  const a = (
    <div>
      <ul>
        <li class="item" innerHTML="1" />
        <li class="item" innerHTML="2" />
        <li class="item" innerHTML="3" />
        <li class="item" innerHTML="4" />
      </ul>
    </div>
  )

  const b = (
    <div>
      <ul>
        <li class="item" innerHTML="1" />
        <li class="item" innerHTML="2" />
        <li class="item" innerHTML="3" />
        <li class="item isActive" innerHTML="4" />
      </ul>
    </div>
  )

  const patches = diff(a, b)

  const element: any = createNodeFromVNode(a, null)

  patch(element, patches, null)

  expect(element.outerHTML).toEqual(
    '<div><ul><li class="item">1</li><li class="item">2</li><li class="item">3</li><li class="item isActive">4</li></ul></div>'
  )
})
