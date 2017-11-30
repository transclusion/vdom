export function basicObjectAssign(to: any, from: any) {
  Object.keys(from).forEach(key => {
    to[key] = from[key]
  })

  return to
}
