import {
  createNode,
  createVElement,
  diff,
  patch,
  thunk,
  toHTML,
  toVNode
} from '../src/'

test('patch nested text node', () => {
  const a = (
    <div>
      <p>
        {'foo'}
        {'bar'}
      </p>
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </ul>
    </div>
  )
  const b = (
    <div class="app">
      <p>
        {'foo'}
        {'baz'}
      </p>
      <ul>
        <li>1</li>
        <li>2</li>
        <li>4</li>
      </ul>
    </div>
  )
  const element = createNode(a) as Element
  const patches = diff(a, b)

  patch(element, patches)

  expect(element.outerHTML).toEqual(
    '<div class="app"><p>foobaz</p><ul><li>1</li><li>2</li><li>4</li></ul></div>'
  )
})

test('patch attribute in a list', () => {
  const a = (
    <div>
      <div class="item">foo</div>
      <div class="item">foo</div>
      <div class="item">foo</div>
      <div class="item">foo</div>
    </div>
  )
  const b = (
    <div>
      <div class="item">foo</div>
      <div class="item">foo</div>
      <div class="item isActive">foo</div>
      <div class="item">foo</div>
    </div>
  )
  const patches = diff(a, b)

  expect(patches).toHaveLength(2)
})

test('remove elements from a list', () => {
  const a = (
    <div class="container">
      <ul class="row">
        <li class="col">1</li>
        <li class="col">2</li>
        <li class="col">3</li>
        <li class="col">4</li>
        <li class="col">5</li>
        <li class="col">6</li>
      </ul>
    </div>
  )
  const b = (
    <div class="container">
      <ul class="row">
        <li class="col">1</li>
      </ul>
    </div>
  )
  const element = createNode(a) as Element
  const patches = diff(a, b)

  patch(element, patches)

  expect(element.outerHTML).toEqual(
    `<div class="container"><ul class="row"><li class="col">1</li></ul></div>`
  )
})

test('patch from empty list to an array of elements', () => {
  const a = (
    <div class="container">
      <ul class="row" />
    </div>
  )
  const b = (
    <div class="container">
      <ul class="row">
        {Array.from(Array(5)).map((_: any, i: number) => <li>{i}</li>)}
      </ul>
    </div>
  )
  const element = createNode(a) as Element
  const patches = diff(a, b)

  patch(element, patches)

  expect(element.outerHTML).toEqual(
    `<div class="container"><ul class="row"><li>0</li><li>1</li><li>2</li><li>3</li><li>4</li></ul></div>`
  )
})

test('patch deeply nested node', () => {
  const a = (
    <div>
      <div>
        <div>
          <div>
            <div>
              <div>foo</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  const b = (
    <div>
      <div>
        <div>
          <div>
            <div>
              <div>bar</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  const element = createNode(a) as Element
  const patches = diff(a, b)

  patch(element, patches)
  expect(element.outerHTML).toEqual(
    `<div><div><div><div><div><div>bar</div></div></div></div></div></div>`
  )
})

test('use thunk to optimize rendering', () => {
  expect.assertions(2)

  const thunkView = (model: any) => {
    expect(model).toEqual(model)

    return <div>{model}</div>
  }
  const a = <div />
  const b = <div>{thunk(thunkView, 1)}</div>
  const c = <div>{thunk(thunkView, 1)}</div>
  const element = createNode(a) as Element

  patch(element, diff(a, b))
  patch(element, diff(b, c))

  expect(element.outerHTML).toEqual(`<div><div>1</div></div>`)
})

test('trigger "didInsert" hook when adding hook', () => {
  const a = <div />
  const b = <div hook={{didInsert: 'didInsert'}} />
  const element = createNode(a) as Element
  const patches = diff(a, b)

  expect(patches).toHaveLength(2)
  expect(patches[0][1]).toEqual('didInsert')

  patch(element, patches, undefined, (elm, value: any) => {
    expect(value).toEqual('didInsert')
  })
})

test('trigger "didUpdate" hook when patching child nodes', () => {
  expect.assertions(3)

  const a = <div hook={{didUpdate: 'didUpdate'}}>foo</div>
  const b = <div hook={{didUpdate: 'didUpdate'}}>bar</div>
  const element = createNode(a) as Element
  const patches = diff(a, b)

  expect(patches).toHaveLength(4)
  expect(patches[3][1]).toEqual('didUpdate')

  patch(element, patches, undefined, (elm, value: any) => {
    expect(value).toEqual('didUpdate')
  })
})

test('trigger only "didInsert" hook when inserting', () => {
  expect.assertions(1)

  const a = <div />
  const b = (
    <div>
      <span hook={{didInsert: 'didInsert', didUpdate: 'didUpdate'}} />
    </div>
  )
  const element = createNode(a) as Element
  const patches = diff(a, b)

  patch(element, patches, undefined, (elm, value: any) => {
    expect(value).toEqual('didInsert')
  })
})

test('lifecycle #1', () => {
  expect.assertions(4)

  const a = <div hook={{didUpdate: 'didUpdate'}} />
  const b = (
    <div hook={{didUpdate: 'didUpdate'}}>
      <div hook={{didInsert: 'didInsert'}} />
    </div>
  )
  const element = createNode(a) as Element
  const patches = diff(a, b)

  expect(patches).toHaveLength(3)
  expect(patches[2][1]).toEqual('didUpdate')

  let i: number

  i = 0
  patch(element, patches, undefined, (elm, value: any) => {
    expect(value).toEqual(i === 0 ? 'didUpdate' : 'didInsert')
    i++
  })
})

test('lifecycle #2', () => {
  expect.assertions(3)

  const a = <div hook={{didUpdate: 'didUpdate'}} />
  const b = (
    <div hook={{didUpdate: 'didUpdate'}}>
      <div />
      <div />
      <div />
      <div />
    </div>
  )
  const element = createNode(a) as Element
  const patches = diff(a, b)

  expect(patches).toHaveLength(5)
  expect(patches[4][1]).toEqual('didUpdate')

  patch(element, patches, undefined, (elm, value: any) => {
    expect(value).toEqual('didUpdate')
  })
})

test('lifecycle #3', () => {
  const a = (
    <div hook={{didUpdate: 'didUpdate'}}>
      <div />
      <div />
    </div>
  )
  const b = (
    <div hook={{didUpdate: 'didUpdate'}}>
      <div />
      <div />
    </div>
  )
  const patches = diff(a, b)

  expect(patches).toHaveLength(0)
})

test('toHTML', () => {
  const a = (
    <div class="foo">
      <p>bar</p>
    </div>
  )

  expect(toHTML(a)).toEqual('<div class="foo"><p>bar</p></div>')
})

test('custom element', () => {
  const a = <div class="root">{createVElement('x-app')}</div>
  const b = (
    <div class="root">{createVElement('x-app', undefined, <h1>foo</h1>)}</div>
  )
  const patches = diff(a, b)

  expect(patches).toHaveLength(2)
})

test('innerHTML', () => {
  const a = <div innerHTML="test" />
  const element = createNode(a) as Element

  expect(element.outerHTML).toEqual('<div>test</div>')
})

test('patch innerHTML', () => {
  const a = <div innerHTML="foo" />
  const b = <div innerHTML="bar" />
  const element = createNode(a) as Element
  const patches = diff(a, b)

  patch(element, patches)

  expect(element.outerHTML).toEqual('<div>bar</div>')
})

test('toVNode innerHTML', () => {
  const a = <div>foo</div>
  const b = <div innerHTML="foo" />
  const element = createNode(a) as Element
  const vNode = toVNode(element)
  const patches = diff(vNode, b)

  patch(element, patches)

  expect(element.outerHTML).toEqual('<div>foo</div>')
})

test('diff hook values', () => {
  const a = <button hook={{didUpdate: 'a'}} />
  const b = <button hook={{didUpdate: 'b'}} />
  const patches = diff(a, b)

  expect(patches).toHaveLength(2)
  expect(patches[0][0]).toEqual(5)
  expect(patches[0][1]).toEqual('hook')
  expect(patches[0][2].didUpdate).toEqual('b')
  expect(patches[1][0]).toEqual(9)
  expect(patches[1][1]).toEqual('b')
})

test('patch hook values', () => {
  const mockHookHandler = jest.fn()
  const a = <button hook={{didUpdate: 'a'}} />
  const b = <button hook={{didUpdate: 'b'}} />
  const patches = diff(a, b)
  const element = createNode(a, mockHookHandler) as Element

  patch(element, patches, undefined, mockHookHandler)

  expect(mockHookHandler.mock.calls).toHaveLength(1)
  expect(mockHookHandler.mock.calls[0][0]).toEqual(element)
  expect(mockHookHandler.mock.calls[0][1]).toEqual('b')
})

test('trigger "didUpdate" only once', () => {
  const mockHookHandler = jest.fn()
  const a = <div hook={{didUpdate: 'a'}}>foo</div>
  const b = <div hook={{didUpdate: 'b'}}>bar</div>
  const patches = diff(a, b)
  const element = createNode(a, mockHookHandler) as Element

  patch(element, patches, undefined, mockHookHandler)

  expect(mockHookHandler.mock.calls).toHaveLength(1)
  expect(mockHookHandler.mock.calls[0][1]).toEqual('b')
})

test('diff event values', () => {
  const a = <button on={{click: 'a'}} />
  const b = <button on={{click: 'b'}} />
  const patches = diff(a, b)

  expect(patches).toHaveLength(1)
  expect(patches[0][1]).toEqual('on')
  expect(patches[0][2].click).toEqual('b')
})

test('patch event values', () => {
  const mockEventHandler = jest.fn()
  const a = <button on={{click: 'a'}} />
  const b = <button on={{click: 'b'}} />
  const patches = diff(a, b)
  const element = createNode(a, mockEventHandler) as Element

  patch(element, patches, mockEventHandler)

  const clickEvent = document.createEvent('MouseEvents')
  clickEvent.initEvent('click', false, true)
  element.dispatchEvent(clickEvent)

  expect(mockEventHandler.mock.calls).toHaveLength(1)
  expect(mockEventHandler.mock.calls[0][0]).toEqual('click')
  expect(mockEventHandler.mock.calls[0][2]).toEqual('b')
})
