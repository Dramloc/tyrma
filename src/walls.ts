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

const createCorridor = (
  { random }: { random: Random.RandomNumberGenerator },
  areaA: Area.Area,
  areaB: Area.Area,
  walls: Walls
): void => {
  const xA = areaA.x + Math.floor(random() * areaA.width);
  const xB = areaB.x + Math.floor(random() * areaB.width);
  const yA = areaA.y + Math.floor(random() * areaA.height);
  const yB = areaB.y + Math.floor(random() * areaB.height);
  const fromX = Math.min(xA, xB);
  const toX = Math.max(xA, xB);
  const fromY = Math.min(yA, yB);
  const toY = Math.max(yA, yB);
  const halfwayY = Math.floor((fromY + toY) / 2);

  for (let y = fromY; y <= halfwayY; y++) {
    Grid.set(fromX, y, true, walls);
  }
  for (let x = Math.min(fromX, toX); x <= Math.max(fromX, toX); x++) {
    Grid.set(x, halfwayY, true, walls);
  }
  for (let y = halfwayY + 1; y <= toY; y++) {
    Grid.set(toX, y, true, walls);
  }
};

export const generate = (options: WallsOptions): Walls => {
  const { width, height, random } = options;
  // Start with a grid filled with walls
  const walls = Grid.of({
    width,
    height,
    initializer: () => false,
  });

  // Keep a border of one wall around the grid
  const safeArea = { x: 1, y: 1, width: width - 2, height: height - 2 };
  // Create a partition of the safe area
  const partition = Area.randomPartition({ ...options, ...options.partition }, safeArea);

  // Create padding for each room in the partition
  const paddedPartition = Tree.mapLeaves(({ x, y, width, height }) => {
    const paddingTop = Math.floor(
      Random.clamp(
        0,
        height,
        Random.unitPairToGaussianDistribution(
          { mu: options.padding.mu * height, sigma: options.padding.sigma },
          random(),
          random()
        )
      )
    );
    const paddingRight = Math.floor(
      Random.clamp(
        0,
        width,
        Random.unitPairToGaussianDistribution(
          { mu: options.padding.mu * width, sigma: options.padding.sigma },
          random(),
          random()
        )
      )
    );
    const paddingBottom = Math.floor(
      Random.clamp(
        0,
        height,
        Random.unitPairToGaussianDistribution(
          { mu: options.padding.mu * height, sigma: options.padding.sigma },
          random(),
          random()
        )
      )
    );
    const paddingLeft = Math.floor(
      Random.clamp(
        0,
        width,
        Random.unitPairToGaussianDistribution(
          { mu: options.padding.mu * width, sigma: options.padding.sigma },
          random(),
          random()
        )
      )
    );
    const paddedArea = {
      x: x + paddingLeft,
      y: y + paddingTop,
      width: width - (paddingLeft + paddingRight),
      height: height - (paddingTop + paddingBottom),
    };
    return paddedArea;
  }, partition);

  // Retrieve room bounds from tree
  const rooms = Tree.leaves(paddedPartition).map(Tree.node);

  // Empty an area in each room
  rooms.forEach((room) => {
    Grid.setArea(room, true, walls);
  });

  Tree.branches(paddedPartition).forEach((branch) => {
    const leftRooms = Tree.leaves(Tree.left(branch))
      .map(Tree.node)
      .filter((room) => room.width !== 0 && room.height !== 0);
    const rightRooms = Tree.leaves(Tree.right(branch))
      .map(Tree.node)
      .filter((room) => room.width !== 0 && room.height !== 0);
    const leftRoom = leftRooms[Math.floor(random() * leftRooms.length)];
    const rightRoom = rightRooms[Math.floor(random() * rightRooms.length)];
    if (leftRoom && rightRoom) {
      createCorridor({ random }, leftRoom, rightRoom, walls);
    }
  });

  // Collapse 1-wide north-south walls
  Grid.forEachWithCoordinates((value, x, y) => {
    if (value === false && Grid.get(x, y - 1, walls) === true && Grid.get(x, y + 1, walls) === true) {
      Grid.set(x, y, true, walls);
    }
  }, walls);

  return walls;
};
