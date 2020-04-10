import * as Area from "./area";

export type Grid<T> = { width: number; height: number; data: T[] };

export type GridOptions<T> = {
  width: number;
  height: number;
  initializer: (x: number, y: number) => T;
};
export const of = <T>({ width, height, initializer }: GridOptions<T>): Grid<T> => {
  return mapWithCoordinates((_, x, y) => initializer(x, y), {
    width,
    height,
    data: Array.from(Array(width * height)),
  });
};

export const get = <T>(x: number, y: number, grid: Grid<T>): T => {
  return grid.data[x + y * grid.width];
};

export const set = <T>(x: number, y: number, value: T, grid: Grid<T>): Grid<T> => {
  return {
    ...grid,
    data: Object.assign([], grid.data, { [x + y * grid.width]: value }),
  };
};

export const mapArea = <T, U>(area: Area.Area, fn: (value: T) => U, grid: Grid<T>): Grid<T | U> => {
  return mapWithCoordinates((currentValue, x, y) => {
    return Area.contains(area, x, y) ? fn(currentValue) : currentValue;
  }, grid);
};

export const setArea = <T, U>(area: Area.Area, value: U, grid: Grid<T>): Grid<T | U> => {
  return mapArea(area, () => value, grid);
};

export const map = <T, U>(fn: (value: T) => U, grid: Grid<T>): Grid<U> => {
  return {
    ...grid,
    data: grid.data.map(fn),
  };
};

export const mapWithCoordinates = <T, U>(fn: (value: T, x: number, y: number) => U, grid: Grid<T>): Grid<U> => {
  return {
    ...grid,
    data: grid.data.map((value, i) => {
      const x = i % grid.width;
      const y = Math.floor(i / grid.width);
      return fn(value, x, y);
    }),
  };
};

export const row = <T>(y: number, grid: Grid<T>): T[] => {
  const row = grid.data.slice(y * grid.width, (y + 1) * grid.width);
  return row;
};

export const rows = <T>(grid: Grid<T>): T[][] => {
  let rows = [];
  for (let y = 0; y < grid.height; y += 1) {
    rows.push(row(y, grid));
  }
  return rows;
};

export const column = <T>(x: number, grid: Grid<T>): T[] => {
  let column = [];
  for (let y = 0; y < grid.height; y += 1) {
    column.push(get(x, y, grid));
  }
  return column;
};

export const columns = <T>(grid: Grid<T>): T[][] => {
  let columns = [];
  for (let x = 0; x < grid.width; x += 1) {
    columns.push(column(x, grid));
  }
  return columns;
};

export const inspect = <T>(grid: Grid<T>): string => {
  return rows(grid)
    .map((row) => row.map((value) => String(value)).join(""))
    .join("\n");
};
