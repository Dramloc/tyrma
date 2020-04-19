export type SeedGenerator = () => number;
export type RandomNumberGenerator = () => number;

// https://github.com/bryc/code/blob/master/jshash/PRNGs.md#addendum-a-seed-generating-functions
const xmur3 = (value: string): SeedGenerator => {
  for (var i = 0, h = 1779033703 ^ value.length; i < value.length; i++) {
    h = Math.imul(h ^ value.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
};

// https://github.com/bryc/code/blob/master/jshash/PRNGs.md#sfc32
export const sfc32 = (a: number, b: number, c: number, d: number): RandomNumberGenerator => {
  return () => {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    var t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
};

export const createGenerator = (seed: string): RandomNumberGenerator => {
  const seedGenerator = xmur3(seed);
  return sfc32(seedGenerator(), seedGenerator(), seedGenerator(), seedGenerator());
};

/** Converts the given unit `value` to the `[min, max]` range */
export const unitToFloatRange = (min: number, max: number, value: number): number => {
  return value * (max - min) + min;
};

/** Converts the given unit `value` to the `[min, max]` range and convert it to an integer */
export const unitToIntRange = (min: number, max: number, value: number): number => {
  return Math.floor(unitToFloatRange(min, max, value));
};

/** Converts the given unit `value` to a boolean */
export const unitToBoolean = (value: number): boolean => {
  return value > 0.5;
};

export type GaussianDistributionOptions = { mu: number; sigma: number };
export const unitPairToGaussianDistribution = (
  { mu, sigma }: GaussianDistributionOptions,
  u0: number,
  u1: number
): number => {
  const z0 = Math.sqrt(-2.0 * Math.log(u0)) * Math.cos(Math.PI * 2 * u1);
  return z0 * sigma + mu;
};

export const clamp = (min: number, max: number, value: number): number => {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
};
