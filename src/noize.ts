import { randomBySeed } from './random'

const PERLIN_YWRAPB = 4
const PERLIN_YWRAP = 1 << PERLIN_YWRAPB
const PERLIN_ZWRAPB = 8
const PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB
const PERLIN_SIZE = 4095

const perlinOctaves = 4 // default to medium smooth
const perlinAmpFalloff = 0.5 // 50% reduction/octave

const scaledCosine = (i: number) => 0.5 * (1.0 - Math.cos(i * Math.PI))

let perlin: number[] // will be initialized lazily by noise() or noiseSeed()

export function initNoize(seed: number) {
  const rand = randomBySeed(seed)
  perlin = new Array<number>(PERLIN_SIZE + 1)

  for (let i = 0; i < PERLIN_SIZE + 1; i++) {
    perlin[i] = rand()
  }
}

export function noize(x: number, y = 0, z = 0) {
  if (!perlin) {
    throw new Error('run initNoize first')
  }

  if (x < 0) {
    x = -x
  }
  if (y < 0) {
    y = -y
  }
  if (z < 0) {
    z = -z
  }

  let xi = Math.floor(x)
  let yi = Math.floor(y)
  let zi = Math.floor(z)
  let xf = x - xi
  let yf = y - yi
  let zf = z - zi
  let rxf
  let ryf

  let r = 0
  let ampl = 0.5

  let n1
  let n2
  let n3

  for (let o = 0; o < perlinOctaves; o++) {
    let of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB)

    rxf = scaledCosine(xf)
    ryf = scaledCosine(yf)

    n1 = perlin[of & PERLIN_SIZE]!
    n1 += rxf * (perlin[(of + 1) & PERLIN_SIZE]! - n1)
    n2 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE]!
    n2 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE]! - n2)
    n1 += ryf * (n2 - n1)

    of += PERLIN_ZWRAP
    n2 = perlin[of & PERLIN_SIZE]!
    n2 += rxf * (perlin[(of + 1) & PERLIN_SIZE]! - n2)
    n3 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE]!
    n3 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE]! - n3)
    n2 += ryf * (n3 - n2)

    n1 += scaledCosine(zf) * (n2 - n1)

    r += n1 * ampl
    ampl *= perlinAmpFalloff
    xi <<= 1
    xf *= 2
    yi <<= 1
    yf *= 2
    zi <<= 1
    zf *= 2

    if (xf >= 1.0) {
      xi++
      xf--
    }
    if (yf >= 1.0) {
      yi++
      yf--
    }
    if (zf >= 1.0) {
      zi++
      zf--
    }
  }
  return r
}
