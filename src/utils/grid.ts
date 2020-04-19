import * as Area from "./area";

export type Grid<T> = { width: number; height: number; data: T[] };

export type GridOptions<T> = {
  width: number;
  height: number;
  initializer: (x: number, y: number) => T;
};
export const of = <T>({ width, height, initializer }: GridOptions<T>): Grid<T> => {
  const grid = {
    width,
    height,
    data: Array.from(Array(width * height)),
  };
  forEachWithCoordinates((_, x, y) => {
    set(x, y, initializer(x, y), grid);
  }, grid);
  return grid;
};

export const get = <T>(x: number, y: number, grid: Grid<T>): T => {
  return grid.data[x + y * grid.width];
};

export const set = <T>(x: number, y: number, value: T, grid: Grid<T>): void => {
  grid.data[x + y * grid.width] = value;
};

export const setArea = <T, U>(area: Area.Area, value: T, grid: Grid<T>): void => {
  for (let x = area.x; x < area.x + area.width; ++x) {
    for (let y = area.y; y < area.y + area.height; ++y) {
      grid.data[x + y * grid.width] = value;
    }
  }
};

export const forEachWithCoordinates = <T>(fn: (value: T, x: number, y: number) => void, grid: Grid<T>): void => {
  const $forEachWithCoordinates = (value: T, i: number) => {
    const x = i % grid.width;
    const y = Math.floor(i / grid.width);
    fn(value, x, y);
  };
  grid.data.forEach($forEachWithCoordinates);
};
