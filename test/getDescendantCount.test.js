// @flow

/** @jsx el */

// eslint-disable-next-line no-unused-vars
import el from '../src/createElement'
import getDescendantCount from '../src/getDescendantCount'

test('descendant count of leaf node should equal 0', () => {
  const vNode = <div />

  expect(getDescendantCount(vNode)).toEqual(0)
})

test('descendant count of text node should equal 0', () => {
  const vNode = 'test'

  expect(getDescendantCount(vNode)).toEqual(0)
})

test('should count descendants of nested node', () => {
  const vNode = (
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
  )

  expect(getDescendantCount(vNode)).toEqual(10)
})
