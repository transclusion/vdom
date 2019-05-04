import {createNode, createVElement, diff, patch, toVNode} from '../src/'

describe('patch', () => {
  it('should patch nested text node', () => {
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

    expect(element.outerHTML).toBe('<div class="app"><p>foobaz</p><ul><li>1</li><li>2</li><li>4</li></ul></div>')
  })

  it('should patch attribute in a list', () => {
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

  it('should remove elements from a list', () => {
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

    expect(element.outerHTML).toBe(`<div class="container"><ul class="row"><li class="col">1</li></ul></div>`)
  })

  it('should patch from empty list to an array of elements', () => {
    const a = (
      <div class="container">
        <ul class="row" />
      </div>
    )

    const b = (
      <div class="container">
        <ul class="row">
          {Array.from(Array(5)).map((_: any, i: number) => (
            <li>{i}</li>
          ))}
        </ul>
      </div>
    )

    const element = createNode(a) as Element
    const patches = diff(a, b)

    patch(element, patches)

    expect(element.outerHTML).toBe(
      `<div class="container"><ul class="row"><li>0</li><li>1</li><li>2</li><li>3</li><li>4</li></ul></div>`
    )
  })

  it('should patch deeply nested node', () => {
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
    expect(element.outerHTML).toBe(`<div><div><div><div><div><div>bar</div></div></div></div></div></div>`)
  })

  it('should patch innerHTML', () => {
    const a = <div innerHTML="foo" />
    const b = <div innerHTML="bar" />
    const element = createNode(a) as Element
    const patches = diff(a, b)

    patch(element, patches)

    expect(element.outerHTML).toBe('<div>bar</div>')
  })

  it('should toVNode innerHTML', () => {
    const a = <div>foo</div>
    const b = <div innerHTML="foo" />
    const element = createNode(a) as Element
    const vNode = toVNode(element)
    const patches = diff(vNode, b)

    patch(element, patches)

    expect(element.outerHTML).toBe('<div>foo</div>')
  })

  it('should patch event values', () => {
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
    expect(mockEventHandler.mock.calls[0][0]).toBe('b')
    expect(mockEventHandler.mock.calls[0][1].type).toBe('click')
  })

  it('should patch vNode with style object', () => {
    const a = <div style={{background: '#000'}} />
    const b = <div style={{background: '#fff', color: '#000'}} />

    const element = createNode(a) as HTMLDivElement
    const patches = diff(a, b)

    patch(element, patches)

    expect(element.outerHTML).toBe('<div style="background: rgb(255, 255, 255); color: rgb(0, 0, 0);"></div>')
  })

  it('should patch input value', () => {
    const a = <input type="text" />
    const b = <input type="text" value="foo" />

    const element = createNode(a) as HTMLInputElement
    const patches = diff(a, b)

    patch(element, patches)

    expect(element.value).toBe('foo')
  })

  it('should patch textarea value', () => {
    const a = <textarea type="text" />
    const b = <textarea type="text" value="foo" />

    const element = createNode(a) as HTMLTextAreaElement
    const patches = diff(a, b)

    patch(element, patches)

    expect(element.value).toBe('foo')
  })

  it('should patch boolean attributes', () => {
    const a = <video autoplay />
    const b = <video muted autoplay={false} />

    const element = createNode(a) as HTMLTextAreaElement
    const patches = diff(a, b)

    patch(element, patches)

    expect(element.outerHTML).toBe('<video muted=""></video>')
  })

  it('should remove attribute', () => {
    const a = <div id="foo" />
    const b = <div />

    const element = createNode(a) as HTMLTextAreaElement
    const patches = diff(a, b)

    patch(element, patches)

    expect(element.outerHTML).toBe('<div></div>')
  })

  it('should throw if unknown patch', () => {
    const patches: any = [[0, 0], [20]]
    const element = createNode(
      <div>
        <span />
      </div>
    ) as Element

    expect(() => patch(element, patches)).toThrow()
  })

  // Lifecycle hooks:

  it('should trigger "didRemove"', () => {
    const mockHookHandler = jest.fn()
    const a = (
      <div>
        <div hook={{didRemove: 'foo'}} />
      </div>
    )
    const b = <div />
    const patches = diff(a, b)
    const element = createNode(a, mockHookHandler) as Element

    const child = element.firstChild

    patch(element, patches, undefined, mockHookHandler)

    expect(mockHookHandler.mock.calls).toHaveLength(1)
    expect(mockHookHandler.mock.calls[0][0]).toBe('foo')
    expect(mockHookHandler.mock.calls[0][1]).toEqual(child)
  })

  // it('should patch hook values', () => {
  //   const mockHookHandler = jest.fn()
  //   const a = <button hook={{didUpdate: 'a'}} />
  //   const b = <button hook={{didUpdate: 'b'}} />
  //   const patches = diff(a, b)
  //   const element = createNode(a, mockHookHandler) as Element
  //
  //   patch(element, patches, undefined, mockHookHandler)
  //
  //   expect(mockHookHandler.mock.calls).toHaveLength(1)
  //   expect(mockHookHandler.mock.calls[0][0]).toBe('b')
  //   expect(mockHookHandler.mock.calls[0][1]).toBe(element)
  // })

  it('should trigger "didUpdate" only once', () => {
    const mockHookHandler = jest.fn()
    const a = <div hook={{didUpdate: 'a'}}>foo</div>
    const b = <div hook={{didUpdate: 'b'}}>bar</div>
    const patches = diff(a, b)
    const element = createNode(a, mockHookHandler) as Element

    patch(element, patches, undefined, mockHookHandler)

    expect(mockHookHandler.mock.calls).toHaveLength(1)
    expect(mockHookHandler.mock.calls[0][0]).toBe('b')
  })

  it('should trigger "didInsert" hook when adding hook', () => {
    const a = <div />
    const b = <div hook={{didInsert: 'INSERT'}} />

    const element = createNode(a) as Element
    const patches = diff(a, b)

    expect(patches).toHaveLength(2)
    expect(patches[0][1]).toBe('INSERT')

    const mockHookHandler = jest.fn()

    patch(element, patches, undefined, mockHookHandler)

    expect(mockHookHandler.mock.calls).toHaveLength(1)
    expect(mockHookHandler.mock.calls[0][0]).toBe('INSERT')
    expect(mockHookHandler.mock.calls[0][1]).toBe(element)
  })

  it('should trigger "didUpdate" hook when patching child nodes', () => {
    const a = <div hook={{didUpdate: 'UPDATE'}}>foo</div>
    const b = <div hook={{didUpdate: 'UPDATE'}}>bar</div>

    const element = createNode(a) as Element
    const patches = diff(a, b)

    expect(patches).toHaveLength(4)
    expect(patches[3][1]).toBe('UPDATE')

    const mockHookHandler = jest.fn()

    patch(element, patches, undefined, mockHookHandler)

    expect(mockHookHandler.mock.calls).toHaveLength(1)
    expect(mockHookHandler.mock.calls[0][0]).toBe('UPDATE')
    expect(mockHookHandler.mock.calls[0][1]).toBe(element)
  })

  it('should trigger only "didInsert" hook when inserting', () => {
    const a = <div />
    const b = (
      <div>
        <span hook={{didInsert: 'INSERT', didUpdate: 'UPDATE'}} />
      </div>
    )

    const element = createNode(a) as Element
    const patches = diff(a, b)

    const mockHookHandler = jest.fn()

    patch(element, patches, undefined, mockHookHandler)

    expect(mockHookHandler.mock.calls).toHaveLength(1)
    expect(mockHookHandler.mock.calls[0][0]).toBe('INSERT')
    expect(mockHookHandler.mock.calls[0][1]).toBe(element.firstChild)
  })

  it('should trigger "didUpdate" when inserting a child node', () => {
    const a = <div hook={{didUpdate: 'UPDATE'}} />
    const b = (
      <div hook={{didUpdate: 'UPDATE'}}>
        <div hook={{didInsert: 'INSERT'}} />
      </div>
    )

    const element = createNode(a) as Element
    const patches = diff(a, b)

    expect(patches).toHaveLength(5)
    expect(patches[2][1]).toBe('INSERT')
    expect(patches[4][1]).toBe('UPDATE')

    const mockHookHandler = jest.fn()

    patch(element, patches, undefined, mockHookHandler)

    expect(mockHookHandler.mock.calls).toHaveLength(2)
    expect(mockHookHandler.mock.calls[0][0]).toBe('UPDATE')
    expect(mockHookHandler.mock.calls[0][1]).toBe(element)
    expect(mockHookHandler.mock.calls[1][0]).toBe('INSERT')
    expect(mockHookHandler.mock.calls[1][1]).toBe(element.firstChild)
  })

  it('should trigger "didUpdate" once when removing children', () => {
    const a = <div hook={{didUpdate: 'UPDATE'}} />
    const b = (
      <div hook={{didUpdate: 'UPDATE'}}>
        <div />
        <div />
        <div />
        <div />
      </div>
    )

    const element = createNode(a) as HTMLDivElement
    const patches = diff(a, b)

    expect(patches).toHaveLength(5)
    expect(patches[4][1]).toBe('UPDATE')

    const mockHookHandler = jest.fn()

    patch(element, patches, undefined, mockHookHandler)

    expect(mockHookHandler.mock.calls).toHaveLength(1)
    expect(mockHookHandler.mock.calls[0][0]).toBe('UPDATE')
    expect(mockHookHandler.mock.calls[0][1]).toBe(element)
  })
})
