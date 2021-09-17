/* eslint-disable no-console */

import {diff, patch, toVNode} from '@transclusion/vdom'
import {generateRows} from './generateData'
import {State} from './types'
import app from './views/app'

const element = document.querySelector('#root')

let state: State = {rows: [], selected: null}

const handleMsg = (msg: any) => {
  switch (msg.type) {
    case 'run':
      state = Object.assign({}, state, {rows: generateRows(1000)})
      console.time('run')
      render()
      setTimeout(() => {
        console.timeEnd('run')
      }, 0)
      break

    case 'runLots':
      state = Object.assign({}, state, {rows: generateRows(10000)})
      console.time('runLots')
      render()
      setTimeout(() => {
        console.timeEnd('runLots')
      }, 0)
      break

    case 'update':
      state = Object.assign({}, state, {
        rows: state.rows.map((row, idx) => {
          if (idx % 10 === 0) {
            return Object.assign({}, row, {label: `${row.label} !!!`})
          }

          return row
        }),
      })
      console.time('update')
      render()
      setTimeout(() => {
        console.timeEnd('update')
      }, 0)
      break

    case 'add':
      state = Object.assign({}, state, {
        rows: state.rows.concat(generateRows(1000)),
      })
      console.time('add')
      render()
      setTimeout(() => {
        console.timeEnd('add')
      }, 0)
      break

    case 'clear':
      state = {rows: []}
      console.time('clear')
      render()
      setTimeout(() => {
        console.timeEnd('clear')
      }, 0)
      break

    case 'delete':
      state = Object.assign({}, state, {
        rows: state.rows.filter((row) => row.id !== msg.id),
      })
      console.time('delete')
      render()
      setTimeout(() => {
        console.timeEnd('delete')
      }, 0)
      break

    case 'select':
      state = Object.assign({}, state, {
        selected: msg.id,
      })
      console.time('select')
      render()
      setTimeout(() => {
        console.timeEnd('select')
      }, 0)
      break

    case 'swapRows':
      if (state.rows.length > 10) {
        const rows = state.rows.slice(0)
        const a = rows[4]

        rows[4] = rows[9]
        rows[9] = a
        state = Object.assign({}, state, {rows})
        console.time('swapRows')
        render()
        setTimeout(() => {
          console.timeEnd('swapRows')
        }, 0)
      } else {
        console.warn('no rows to swap')
      }

      break
  }
}

let vNode = toVNode(element!)

const render = () => {
  const nextVNode = app(state)
  const patches = diff(vNode, nextVNode)

  patch(element!, patches, handleMsg)
  vNode = nextVNode
}

render()
