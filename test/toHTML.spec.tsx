import {createVElement, toHTML} from '../src/'

describe('toHTML', () => {
  it('toHTML', () => {
    const a = (
      <div class="foo">
        <p>bar</p>
      </div>
    )

    expect(toHTML(a)).toEqual('<div class="foo"><p>bar</p></div>')
  })
})
