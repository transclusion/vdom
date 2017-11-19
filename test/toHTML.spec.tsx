import {createVElement, toHTML} from '../src/'

describe('toHTML', () => {
  it('should render a virtual node to HTML', () => {
    const a = (
      <div class="foo">
        <p>bar</p>
      </div>
    )

    expect(toHTML(a)).toEqual('<div class="foo"><p>bar</p></div>')
  })

  it('should render a virtual node with a style object attribute to HTML', () => {
    const a = (
      <div class="foo" style={{background: '#ccc'}}>
        <p>bar</p>
      </div>
    )

    expect(toHTML(a)).toEqual('<div class="foo" style="background: #ccc"><p>bar</p></div>')
  })

  it('should render a virtual node with a style string attribute to HTML', () => {
    const a = (
      <div class="foo" style="background: #ccc">
        <p>bar</p>
      </div>
    )

    expect(toHTML(a)).toEqual('<div class="foo" style="background: #ccc"><p>bar</p></div>')
  })

  it('should render a virtual node with boolean attribute', () => {
    const a = <input type="text" disabled />

    expect(toHTML(a)).toEqual('<input type="text" disabled>')
  })

  it('should render a virtual text node to an HTML', () => {
    const a = 'foo'

    expect(toHTML(a)).toEqual('foo')
  })
})
