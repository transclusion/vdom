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

  it('should diff custom element', () => {
    const a = <div class="root">{createVElement('x-app')}</div>
    const b = <div class="root">{createVElement('x-app', undefined, <h1>foo</h1>)}</div>
    const patches = diff(a, b)

    expect(patches).toHaveLength(2)
    expect(patches[0][0]).toEqual(1) // PUSH_NODE
    expect(patches[0][1]).toEqual(0)
    expect(patches[1][0]).toEqual(2) // INSERT
    expect(patches[1][1].name).toEqual('h1')
  })

  it('should produce empty diff if event values did not change', () => {
    const eventValues = {click: 'foo'}
    const a = <button on={eventValues} />
    const b = <button on={eventValues} />
    const patches = diff(a, b)

    expect(patches).toHaveLength(0)
  })

  it('should produce empty diff if hooks values did not change', () => {
    const hookValues = {didUpdate: 'foo'}
    const a = <button hook={hookValues} />
    const b = <button hook={hookValues} />
    const patches = diff(a, b)

    expect(patches).toHaveLength(0)
  })

  it('should add event listeners', () => {
    const a = <button />
    const b = <button on={{click: 'foo'}} />
    const patches = diff(a, b)

    expect(patches).toHaveLength(1)
    expect(patches[0]).toEqual([5, 'on', {click: 'foo'}])
  })

  it('should add more event listeners', () => {
    const a = <button on={{click: 'foo'}} />
    const b = <button on={{click: 'foo', mouseover: 'bar'}} />
    const patches = diff(a, b)

    expect(patches).toHaveLength(1)
    expect(patches[0]).toEqual([5, 'on', {click: 'foo', mouseover: 'bar'}])
  })

  it('should replace element', () => {
    const a = <div>foo</div>
    const b = <p hook={{didInsert: 'INSERT'}}>bar</p>
    const patches = diff(a, b)

    expect(patches).toHaveLength(2)
    expect(patches[0]).toEqual([3, {name: 'p', data: {hook: {didInsert: 'INSERT'}}, children: ['bar']}])
    expect(patches[1]).toEqual([8, 'INSERT'])
  })

  it('should not diff equal innerHTML', () => {
    const a = (
      <div id="foo">
        <p>bar</p>
      </div>
    )
    const b = <div id="foo" innerHTML={`<p>bar</p>`} />
    const patches = diff(a, b)

    expect(patches).toHaveLength(0)
  })

  // Event listeners

  it('should add event listeners', () => {
    const a = <div id="foo" />
    const b = <div id="foo" on={{click: 'CLICK'}} />
    const patches = diff(a, b)

    expect(patches).toHaveLength(1)
    expect(patches[0]).toEqual([5, 'on', {click: 'CLICK'}])
  })

  it('should remove event listeners', () => {
    const a = <div id="foo" on={{click: 'CLICK'}} />
    const b = <div id="foo" />
    const patches = diff(a, b)

    expect(patches).toHaveLength(1)
    expect(patches[0]).toEqual([6, 'on'])
  })
})
