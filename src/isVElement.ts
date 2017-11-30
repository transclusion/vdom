export function isVElement(x: any) {
  return typeof x === 'object' && typeof x.name === 'string'
}
