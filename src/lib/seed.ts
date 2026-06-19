/**
 * Tiny deterministic PRNG so detail pages (account / block / tx) render
 * stable, repeatable data for a given seed string.
 */
export function hashString(str: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function mulberry32(seed: number) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Returns a deterministic rng() function seeded by an arbitrary string. */
export function rngFrom(seed: string) {
  return mulberry32(hashString(seed))
}

export function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}

export function range(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min)
}

/** Build a deterministic hex string of `len` chars from an rng. */
export function seededHex(rng: () => number, len: number): string {
  const HEX = '0123456789abcdef'
  let out = '0x'
  for (let i = 0; i < len; i++) out += HEX[Math.floor(rng() * 16)]
  return out
}
