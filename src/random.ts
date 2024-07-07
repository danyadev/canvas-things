export function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomFloat(min: number, max: number) {
  return (Math.random() * (max - min)) + min
}

/**
 * mean - среднее значение
 * stdDev - допустимое отклонение
 */
export function randomNormal(mean: number, stdDev: number): number {
  let u1 = 0
  let u2 = 0
  // Конвертируем [0,1) в (0,1)
  while (u1 === 0 || u2 === 0) {
    u1 = Math.random()
    u2 = Math.random()
  }

  // считаем стандартное нормально распределенное число (mean = 0, stdDev = 1)
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)
  // Преобразуем его в нормальное распределение с заданными mean и stdDev
  return (z0 * stdDev) + mean
}

/**
 * Возвращает функцию для рандома, зависящую от сида.
 * Возвращает значение в диапазоне [0, 1)
 */
export function randomBySeed(seed: number) {
  // Linear Congruential Generator; Variant of a Lehman Generator

  // Cast the seed to an unsigned 32-bit integer
  let z = seed >>> 0

  // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
  // m is basically chosen to be large (as it is the max period)
  // and for its relationships to a and c
  const m = 4294967296
  // a - 1 should be divisible by m's prime factors
  const a = 1664525
  // c and m should be co-prime
  const c = 1013904223

  return () => {
    // define the recurrence relationship
    z = ((a * z) + c) % m
    // return a float in [0, 1)
    // if z = m then z / m = 0 therefore (z % m) / m < 1 always
    return z / m
  }
}
