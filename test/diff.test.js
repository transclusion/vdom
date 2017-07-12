// @flow

/** @jsx el */

import diff from '../src/diff'
// eslint-disable-next-line no-unused-vars
import el from '../src/createElement'

test('should replace text content', () => {
  const a = <div>foo</div>
  const b = <div>bar</div>

  const patches = diff(a, b)

  expect(patches.length).toEqual(1)

  const patch: any = patches[0]

  expect(patch.type).toEqual('REPLACE')

  expect(patch.vNode).toEqual('bar')
  expect(patch.index).toEqual(1)
})

test('should replace deeply nested text node', () => {
  const a = (
    <zero>
      <one>
        <two>three</two>
        <four>five</four>
      </one>
      <six>
        <seven>eight</seven>
        <nine>ten</nine>
        <eleven>twelve</eleven>
      </six>
    </zero>
  )

  const b = (
    <zero>
      <one>
        <two>three</two>
        <four>5</four>
      </one>
      <six>
        <seven>eight</seven>
        <nine>10</nine>
        <eleven>twelve</eleven>
      </six>
    </zero>
  )

  const patches = diff(a, b)

  expect(patches.length).toEqual(2)

  const patch0: any = patches[0]
  const patch1: any = patches[1]

  expect(patch0.type).toEqual('REPLACE')

  expect(patch0.vNode).toEqual('5')
  expect(patch0.index).toEqual(5)

  expect(patch1.type).toEqual('REPLACE')

  expect(patch1.vNode).toEqual('10')
  expect(patch1.index).toEqual(10)
})

test('should create "REMOVE" patches', () => {
  const a = (
    <div>
      <span>1</span>
      <span>2</span>
    </div>
  )
  const b = <div />

  const patches = diff(a, b)

  expect(patches.length).toEqual(2)

  const patch0 = patches[0]
  const patch1 = patches[1]

  expect(patch0.type).toEqual('REMOVE')
  expect(patch0.index).toEqual(1)

  expect(patch1.type).toEqual('REMOVE')
  expect(patch1.index).toEqual(1)
})

test('should create "REPLACE" and "REMOVE" patches (nested)', () => {
  const a = (
    <div>
      <span>1</span>
      <span>2</span>
      <span>3</span>
      <span>4</span>
      <span>5</span>
    </div>
  )
  const b = (
    <div>
      <div>
        <span>test</span>
      </div>
    </div>
  )
  const patches = diff(a, b)

  expect(patches.length).toEqual(5)

  const patch0 = patches[0]
  const patch1 = patches[1]
  const patch4 = patches[4]

  expect(patch0.type).toEqual('REPLACE')
  expect(patch0.index).toEqual(1)

  expect(patch1.type).toEqual('REMOVE')
  expect(patch1.index).toEqual(4)

  expect(patch4.type).toEqual('REMOVE')
  expect(patch4.index).toEqual(4)
})

test('should create "REPLACE" and "REMOVE" patches (text)', () => {
  const a = (
    <div>
      <span>1</span>
      <span>2</span>
      <span>3</span>
      <span>4</span>
      <span>5</span>
    </div>
  )
  const b = <div>test</div>
  const patches = diff(a, b)

  expect(patches.length).toEqual(5)

  const patch0 = patches[0]
  const patch1 = patches[1]
  const patch4 = patches[4]

  expect(patch0.type).toEqual('REPLACE')
  expect(patch0.index).toEqual(1)

  expect(patch1.type).toEqual('REMOVE')
  expect(patch1.index).toEqual(2)

  expect(patch4.type).toEqual('REMOVE')
  expect(patch4.index).toEqual(2)
})

test('diff innerHTML', () => {
  const a = (
    <div>
      <h1>Test</h1>
    </div>
  )

  const b = (
    <div>
      <h1 innerHTML="Test" />
    </div>
  )

  const patches = diff(a, b)

  expect(patches.length).toEqual(0)
})
