import './styles.css'
import './mainProcess/handleBoundsChange'
import start1 from './1-noizeMap'

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d', { willReadFrequently: true })!

const dpr = window.devicePixelRatio
const width = window.innerWidth
const height = window.innerHeight

export { canvas, ctx, dpr, width, height }

document.body.append(canvas)

canvas.width = width * dpr
canvas.height = height * dpr
canvas.style.width = `${width}px`
canvas.style.height = `${height}px`

ctx.scale(dpr, dpr)

// const toRadians = (degrees: number) => (Math.PI / 180) * degrees

start1()
