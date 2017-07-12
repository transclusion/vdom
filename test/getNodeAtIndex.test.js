// @flow

/** @jsx el */

// eslint-disable-next-line no-unused-vars
import el from '../src/createElement'
import createNodeFromVNode from '../src/createNodeFromVNode'
import getNodeAtIndex from '../src/getNodeAtIndex'

test('get node at index', () => {
  const element = createNodeFromVNode(
    <div>
      <span>2</span>
      <span>4</span>
    </div>,
    () => {}
  )

  const node2 = getNodeAtIndex(element, 2)
  const node4 = getNodeAtIndex(element, 4)

  if (node2 && node2.childNodes) {
    expect(element.childNodes[0].childNodes[0]).toEqual(node2)
  }

  if (node4 && node4.childNodes) {
    expect(element.childNodes[1].childNodes[0]).toEqual(node4)
  }
})
