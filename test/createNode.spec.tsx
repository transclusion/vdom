import {createNode, createVElement} from '../src/'

describe('createNode', () => {
  it('should create node with innerHTML', () => {
    const a = <div innerHTML="test" />
    const element = createNode(a) as Element

    expect(element.outerHTML).toEqual('<div>test</div>')
  })

  it('should create node with styles', () => {
    const a = <h1 style={{fontSize: '72px'}}>foo</h1>
    const element = createNode(a) as Element

    expect(element.outerHTML).toEqual('<h1 style="font-size: 72px;">foo</h1>')
  })

  it('should create node with true boolean attribute', () => {
    const a = <input type="text" disabled={true} />
    const element = createNode(a) as Element

    expect(element.outerHTML).toEqual('<input type="text" disabled="">')
  })

  it('should create node with false boolean attribute', () => {
    const a = <input type="text" disabled={false} />
    const element = createNode(a) as Element

    expect(element.outerHTML).toEqual('<input type="text">')
  })

  it('should create node with number attributes', () => {
    const a = <img src="foo.png" width={200} height={200} />
    const element = createNode(a) as Element

    expect(element.outerHTML).toEqual('<img src="foo.png" width="200" height="200">')
  })

  it('should create text node', () => {
    const a = 'foo'
    const textNode = createNode(a) as Text

    const div = document.createElement('div')
    div.appendChild(textNode)

    expect(div.outerHTML).toEqual('<div>foo</div>')
  })

  it('should create SVG node', () => {
    const a = (
      <svg width="10" height="10" viewbox="0 0 10 10">
        <path d="M 0 0 L 10 10" />
      </svg>
    )

    const svg = createNode(a) as SVGElement

    expect(svg.namespaceURI).toEqual('http://www.w3.org/2000/svg')
    expect(svg.firstChild.namespaceURI).toEqual('http://www.w3.org/2000/svg')
    expect(svg.outerHTML).toEqual(
      '<svg width="10" height="10" viewbox="0 0 10 10"><path d="M 0 0 L 10 10"></path></svg>'
    )
  })
})
