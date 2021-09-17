/** @jsx createVElement */

import {createNode, createVElement, mount} from '../src/'

describe('mount', () => {
  it('should mount node', () => {
    const element = createNode(<div>foo</div>)
    const a = <div on={{click: 'bar'}}>foo</div>

    const mockEventHandler = jest.fn()

    mount(element, a, mockEventHandler)

    const clickEvent = document.createEvent('MouseEvents')

    clickEvent.initEvent('click', false, true)
    element.dispatchEvent(clickEvent)

    expect(mockEventHandler.mock.calls).toHaveLength(1)
    expect(mockEventHandler.mock.calls[0][1].type).toEqual('click')
    expect(mockEventHandler.mock.calls[0][0]).toEqual('bar')
  })
})
