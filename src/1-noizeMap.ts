import { canvas, ctx, dpr, width, height } from '.'
import { initNoize, noize } from './noize'

// initNoize(Math.random() * Number.MAX_SAFE_INTEGER)
initNoize(1)
let offsetX = 0
let offsetY = 0

function renderNoize(
  startX: number,
  startY: number,
  width: number,
  height: number,
  noizeOffsetX: number,
  noizeOffsetY: number
) {
  const render = (x: number, y: number) => {
    const noizeX = (x + noizeOffsetX) / 500
    const noizeY = (y + noizeOffsetY) / 500
    const n = noize(noizeX, noizeY)

    ctx.fillStyle = `rgba(${n * 255}, 0, ${n * 255}, 1)`
    // ctx.fillStyle = `rgba(${255 - (n * 255)}, ${n * 255}, ${255 - (n * 255)}, ${n})`
    // ctx.fillStyle = '#'
    //   + (0xffffff - (n * 0xffffff)).toString(16).split('.')[0]!.padStart(6, '0')
    //   + (0xff - (n * 0xff)).toString(16).split('.')[0]!.padStart(2, '0')
    ctx.fillRect(x, y, 1, 1)
  }

  for (let x = startX; x < width; x++) {
    for (let y = 0; y < height; y++) {
      render(x, y)
    }
  }

  for (let x = 0; x < width; x++) {
    for (let y = startY; y < height; y++) {
      if (x >= startX && y >= startY) {
        continue
      }
      render(x, y)
    }
  }

  ctx.fill()
}

function render() {
  const vx = 4
  const vy = 2

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  ctx.clearRect(0, 0, width, height)
  ctx.putImageData(imageData, -vx * dpr, -vy * dpr)

  offsetX += vx
  offsetY += vy

  renderNoize(width - vx, height - vy, width, height, offsetX, offsetY)
  requestAnimationFrame(render)
}

export default () => {
  renderNoize(0, 0, width, height, offsetX, offsetY)
  requestAnimationFrame(render)
}
