// @flow

type Style = {
  [key: string]: string | number
}

const renderStyle = (styleObj: Style) => {
  return Object.keys(styleObj)
    .map(key => `${key}: ${styleObj[key]}`)
    .join('; ')
    .trim()
}

export default renderStyle
