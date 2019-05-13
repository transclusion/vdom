import {createVElement, expand} from '../src'

describe('expand', () => {
  it('...', () => {
    const A = () => <div>test</div>
    const vNode = expand(<A />)

    expect(vNode).toEqual({name: 'div', data: undefined, children: ['test']})
  })

  it('...', () => {
    const A = ({children}: any) => <div>{children}</div>
    const B = () => <A>B</A>
    const vNode = expand(<B />)

    expect(vNode).toEqual({name: 'div', data: undefined, children: ['B']})
  })

  it('...', () => {
    const A = ({children}: any) => <div>{children}</div>
    const B = () => (
      <div>
        <A>B</A>
      </div>
    )
    const vNode = expand(<B />)

    expect(vNode).toEqual({name: 'div', data: undefined, children: [{name: 'div', children: ['B']}]})
  })
})
