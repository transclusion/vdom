import {createVElement, diff} from '../src/'

describe('diff', () => {
  it('should diff event values', () => {
    const a = <button on={{click: 'a'}} />
    const b = <button on={{click: 'b'}} />
    const patches = diff(a, b)

    expect(patches).toHaveLength(1)
    expect(patches[0][1]).toEqual('on')
    expect(patches[0][2].click).toEqual('b')
  })

  it('should not diff hooks when unchanged', () => {
    const a = (
      <div hook={{didUpdate: 'UPDATE'}}>
        <div />
        <div />
      </div>
    )

    const b = (
      <div hook={{didUpdate: 'UPDATE'}}>
        <div />
        <div />
      </div>
    )

    const patches = diff(a, b)

    expect(patches).toHaveLength(0)
  })

  it('shuold diff custom element', () => {
    const a = <div class="root">{createVElement('x-app')}</div>
    const b = <div class="root">{createVElement('x-app', undefined, <h1>foo</h1>)}</div>
    const patches = diff(a, b)

    expect(patches).toHaveLength(2)
  })
})
