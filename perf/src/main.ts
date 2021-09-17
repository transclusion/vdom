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
      state = {...state, rows: generateRows(1000)}
      console.time('run')
      render()
      console.timeEnd('run')
      break

    case 'runLots':
      state = {...state, rows: generateRows(10000)}
      console.time('runLots')
      render()
      console.timeEnd('runLots')
      break

    case 'update':
      state = {
        ...state,
        rows: state.rows.map((row, idx) => {
          if (idx % 10 === 0) {
            return {...row, label: `${row.label} !!!`}
          }

          return row
        }),
      }
      console.time('update')
      render()
      console.timeEnd('update')
      break

    case 'add':
      state = {...state, rows: state.rows.concat(generateRows(1000))}
      console.time('add')
      render()
      console.timeEnd('add')
      break

    case 'clear':
      state = {rows: []}
      console.time('clear')
      render()
      console.timeEnd('clear')
      break

    case 'delete':
      state = {...state, rows: state.rows.filter((row) => row.id !== msg.id)}
      console.time('delete')
      render()
      console.timeEnd('delete')
      break

    case 'select':
      state = {...state, selected: msg.id}
      console.time('select')
      render()
      console.timeEnd('select')
      break

    case 'swapRows':
      if (state.rows.length > 10) {
        const rows = state.rows.slice(0)
        const a = rows[4]

        rows[4] = rows[9]
        rows[9] = a
        state = {...state, rows}
        console.time('swapRows')
        render()
        console.timeEnd('swapRows')
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
