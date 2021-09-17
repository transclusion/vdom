export interface Row {
  id: number
  label: string
}

export interface State {
  rows: Row[]
  selected?: number | null
}
