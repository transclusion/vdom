/** @jsx createVElement */

import {createNode, createVElement, toVNode} from '../src/'

describe('toVNode', () => {
  it('should convert node to vNode', () => {
    const element = createNode(<div id="bar">foo</div>)
    const a = toVNode(element)

    expect(a).toEqual({name: 'div', data: {id: 'bar'}, children: ['foo']})
  })
})
