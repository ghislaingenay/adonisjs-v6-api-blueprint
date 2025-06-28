import { ColorValue } from '#types'

const haveValidColor = (color: ColorValue): boolean => {
  if (color.startsWith('rgba(') || color.startsWith('rgb(')) {
    const rgb = color
      .replace(/rgba?\(|\)/g, '')
      .split(',')
      .map(Number)
    return rgb.length === 3 || rgb.length === 4
  } else if (color.startsWith('hsla(') || color.startsWith('hsl(')) {
    const hsl = color
      .replace(/hsla?\(|\)/g, '')
      .split(',')
      .map(Number)
    return hsl.length === 3 || hsl.length === 4
  } else if (color.startsWith('#')) {
    return color.length === 7 && /^#[0-9A-F]{6}$/i.test(color)
  }

  return false
}

export default haveValidColor
