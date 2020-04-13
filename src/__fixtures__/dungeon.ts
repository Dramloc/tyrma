import * as Grid from "../grid";

export const renderTestDungeron = () => {
  let walls = Grid.of({ width: 30, height: 30, initializer: () => false });
  walls = Grid.set(1, 3, true, walls);

  walls = Grid.set(3, 3, true, walls);
  walls = Grid.set(4, 3, true, walls);
  walls = Grid.set(5, 3, true, walls);
  walls = Grid.set(4, 2, true, walls);
  walls = Grid.set(4, 4, true, walls);

  walls = Grid.set(7, 1, true, walls);
  walls = Grid.set(8, 1, true, walls);
  walls = Grid.set(9, 1, true, walls);
  walls = Grid.set(10, 1, true, walls);
  walls = Grid.set(11, 1, true, walls);
  walls = Grid.set(7, 2, true, walls);
  walls = Grid.set(8, 2, true, walls);
  walls = Grid.set(9, 2, false, walls);
  walls = Grid.set(10, 2, true, walls);
  walls = Grid.set(11, 2, true, walls);
  walls = Grid.set(7, 3, true, walls);
  walls = Grid.set(8, 3, false, walls);
  walls = Grid.set(9, 3, false, walls);
  walls = Grid.set(10, 3, false, walls);
  walls = Grid.set(11, 3, true, walls);
  walls = Grid.set(7, 4, true, walls);
  walls = Grid.set(11, 4, true, walls);
  walls = Grid.set(7, 5, true, walls);
  walls = Grid.set(8, 5, true, walls);
  walls = Grid.set(9, 5, false, walls);
  walls = Grid.set(10, 5, true, walls);
  walls = Grid.set(11, 5, true, walls);
  walls = Grid.set(7, 6, true, walls);
  walls = Grid.set(8, 6, true, walls);
  walls = Grid.set(9, 6, true, walls);
  walls = Grid.set(10, 6, true, walls);
  walls = Grid.set(11, 6, true, walls);
  walls = Grid.set(7, 7, true, walls);
  walls = Grid.set(8, 7, true, walls);
  walls = Grid.set(9, 7, false, walls);
  walls = Grid.set(10, 7, true, walls);
  walls = Grid.set(11, 7, true, walls);
  walls = Grid.set(7, 8, true, walls);
  walls = Grid.set(8, 8, true, walls);
  walls = Grid.set(9, 8, false, walls);
  walls = Grid.set(10, 8, true, walls);
  walls = Grid.set(11, 8, true, walls);
  walls = Grid.set(7, 9, true, walls);
  walls = Grid.set(8, 9, true, walls);
  walls = Grid.set(9, 9, true, walls);
  walls = Grid.set(10, 9, true, walls);
  walls = Grid.set(11, 9, true, walls);
  return {
    walls,
  };
};
