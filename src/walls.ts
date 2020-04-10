import * as Area from "./area";
import * as Grid from "./grid";
import * as Random from "./random";
import * as Tree from "./tree";

export type WallsOptions = {
  random: Random.RandomNumberGenerator;
  width: number;
  height: number;
  partition: Omit<Area.PartitionAreaOptions, "random">;
  padding: { mu: number; sigma: number };
};
export type Wall = boolean;
export type Walls = Grid.Grid<Wall>;

export const generate = (options: WallsOptions): Walls => {
  const { width, height, random } = options;
  // Start with a grid filled with walls
  const initialWalls = Grid.of({
    width,
    height,
    initializer: () => false,
  });

  // Keep a border of one wall around the grid
  const safeArea = { x: 1, y: 1, width: width - 2, height: height - 2 };
  // Create a partition of the safe area
  const partition = Area.randomPartition({ ...options, ...options.partition }, safeArea);
  // Retrieve room bounds from tree
  const rooms = Tree.leaves(partition).map(Tree.node);

  // Empty an area in each room
  const walls = rooms.reduce((walls, { x, y, width, height }) => {
    const paddingTop = Random.clamp(
      0,
      height,
      Random.unitPairToGaussianDistribution(
        { mu: options.padding.mu * height, sigma: options.padding.sigma },
        random(),
        random()
      )
    );
    const paddingRight = Random.clamp(
      0,
      width,
      Random.unitPairToGaussianDistribution(
        { mu: options.padding.mu * width, sigma: options.padding.sigma },
        random(),
        random()
      )
    );
    const paddingBottom = Random.clamp(
      0,
      height,
      Random.unitPairToGaussianDistribution(
        { mu: options.padding.mu * height, sigma: options.padding.sigma },
        random(),
        random()
      )
    );
    const paddingLeft = Random.clamp(
      0,
      width,
      Random.unitPairToGaussianDistribution(
        { mu: options.padding.mu * width, sigma: options.padding.sigma },
        random(),
        random()
      )
    );
    const paddedArea = {
      x: x + paddingLeft,
      y: y + paddingTop,
      width: width - (paddingLeft + paddingRight),
      height: height - (paddingTop + paddingBottom),
    };
    return Grid.setArea(paddedArea, true, walls);
  }, initialWalls);

  return walls;
};
