import {Row} from './types'

const adjectives = [
  'pretty',
  'large',
  'big',
  'small',
  'tall',
  'short',
  'long',
  'handsome',
  'plain',
  'quaint',
  'clean',
  'elegant',
  'easy',
  'angry',
  'crazy',
  'helpful',
  'mushy',
  'odd',
  'unsightly',
  'adorable',
  'important',
  'inexpensive',
  'cheap',
  'expensive',
  'fancy',
]

const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange']

const nouns = [
  'table',
  'chair',
  'house',
  'bbq',
  'desk',
  'car',
  'pony',
  'cookie',
  'sandwich',
  'burger',
  'pizza',
  'mouse',
  'keyboard',
]

function _random(max: number) {
  return Math.round(Math.random() * 1000) % max
}

let id = 1

export function generateRow(): Row {
  return {
    id: id++,
    label:
      adjectives[_random(adjectives.length)] +
      ' ' +
      colours[_random(colours.length)] +
      ' ' +
      nouns[_random(nouns.length)],
  }
}

export function generateRows(count: number): Row[] {
  const _data = []

  for (let i = 0; i < count; i++) {
    _data.push(generateRow())
  }

  return _data
}
