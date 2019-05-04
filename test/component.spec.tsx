import {createNode, createVElement, diff, patch, toHTML} from '../src/'

describe('component', () => {
  it('should render a component to HTML', () => {
    const Component = ({id}: any) => <div>{id}</div>
    const vNode = (
      <div>
        <Component id="foo" />
      </div>
    )

    expect(toHTML(vNode)).toEqual('<div><div>foo</div></div>')
  })

  it('should render a component to DOM', () => {
    let element = createNode(<div />) as Element

    const Component = ({id}: any) => <div>{id}</div>

    const a = <div />

    const b = (
      <div>
        <Component id="foo" />
        <Component id="bar" />
      </div>
    )

    const patches = diff(a, b)

    element = patch(element, patches)

    expect(element.outerHTML).toEqual('<div><div>foo</div><div>bar</div></div>')
  })

  it('should replace component with element and vice versa', () => {
    const Component = ({id}: any) => <div>{id}</div>

    const A = () => (
      <div>
        <Component id="a" />
      </div>
    )

    const B = () => <div>b</div>

    let vNode = <div />
    let element = createNode(vNode) as Element
    let patches

    // render 1
    const a1 = A()
    patches = diff(vNode, a1)
    element = patch(element, patches)
    vNode = a1

    // render 2
    const b2 = B()
    patches = diff(vNode, b2)
    element = patch(element, patches)
    vNode = b2

    // render 3
    const a3 = A()
    patches = diff(vNode, a3)
    element = patch(element, patches)
    vNode = a3

    expect(element.outerHTML).toEqual('<div><div>a</div></div>')
  })
})
