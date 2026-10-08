// Seeded randomness, so the ink line and the ridges are identical on every visit.

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Smooth 1D value noise in [-1, 1].
export function noise1(r, size = 512) {
  const v = Array.from({ length: size }, () => r() * 2 - 1);
  return (x) => {
    const i = Math.floor(x);
    const f = x - i;
    const u = f * f * (3 - 2 * f);
    const a = v[((i % size) + size) % size];
    const b = v[(((i + 1) % size) + size) % size];
    return a + (b - a) * u;
  };
}
