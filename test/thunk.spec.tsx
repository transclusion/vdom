import {createNode, createVElement, diff, patch, thunk} from '../src/'

describe('thunk', () => {
  it('should not re-render when props are unchanged', () => {
    const mockFn = jest.fn()
    const thunkView = (model: any) => {
      mockFn(model)
      return <div>{model}</div>
    }
    const a = <div />
    const b = <div>{thunk(thunkView, 1)}</div>
    const c = <div>{thunk(thunkView, 1)}</div>
    const element = createNode(a) as Element

    patch(element, diff(a, b))
    patch(element, diff(b, c))

    expect(mockFn.mock.calls).toHaveLength(1)
    expect(mockFn.mock.calls[0][0]).toBe(1)
    expect(element.outerHTML).toBe(`<div><div>1</div></div>`)
  })

  it('should re-render when props are changed', () => {
    const mockFn = jest.fn()
    const thunkView = (model: any) => {
      mockFn(model)
      return <div>{model}</div>
    }
    const a = <div />
    const b = <div>{thunk(thunkView, 1)}</div>
    const c = <div>{thunk(thunkView, 1)}</div>
    const d = <div>{thunk(thunkView, 2)}</div>
    const element = createNode(a) as Element

    patch(element, diff(a, b))
    patch(element, diff(b, c))
    patch(element, diff(c, d))

    expect(mockFn.mock.calls).toHaveLength(2)
    expect(mockFn.mock.calls[0][0]).toBe(1)
    expect(mockFn.mock.calls[1][0]).toBe(2)
    expect(element.outerHTML).toBe('<div><div>2</div></div>')
  })
})
