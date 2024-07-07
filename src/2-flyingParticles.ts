import { canvas, ctx, width, height } from '.'
import { random } from './random'

class Particle {
  constructor(
    public x: number,
    public y: number,
    public speedX: number,
    public speedY: number
  ) {}

  radius = 5
  color = '#fff'

  draw() {
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fill()
  }

  update() {
    if (
      this.x - (this.radius / 2) < 0 ||
      this.x + (this.radius / 2) + this.speedX > width
    ) {
      this.speedX *= -1
    }
    if (
      this.y - (this.radius / 2) < 0 ||
      this.y + (this.radius / 2) + this.speedY > height
    ) {
      this.speedY *= -1
    }

    this.x += this.speedX
    this.y += this.speedY
  }
}

const particles = Array(10).fill(0).map(() => (
  new Particle(
    random(0, width),
    random(0, height),
    random(1, 3),
    random(1, 3)
  )
))

function render() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  for (const particle of particles) {
    particle.draw()
    particle.update()
  }

  requestAnimationFrame(render)
}

requestAnimationFrame(render)
