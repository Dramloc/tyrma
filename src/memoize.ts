export const memoize = <T extends any[], U>(fn: (...args: T) => U) => {
  const cache: { [key: string]: U } = {};
  const memoized = (...args: T) => {
    const key = JSON.stringify(args);
    if (cache[key] !== undefined) {
      return cache[key];
    }
    const value = fn(...args);
    cache[key] = value;
    return value;
  };
  return memoized;
};
