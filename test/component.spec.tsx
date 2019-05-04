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
})
