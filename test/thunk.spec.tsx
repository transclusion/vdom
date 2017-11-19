import {createNode, createVElement, diff, patch, thunk} from '../src/'

describe('thunk', () => {
  it('should use thunk to optimize rendering', () => {
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
})
