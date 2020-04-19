import * as Random from "./random";
import * as Tree from "./tree";

export type Area = { x: number; y: number; width: number; height: number };

export const contains = (area: Area, x: number, y: number): boolean => {
  return x >= area.x && x < area.x + area.width && y >= area.y && y < area.y + area.height;
};

export type PartitionAreaOptions = { random: Random.RandomNumberGenerator; mu: number; sigma: number };
export const randomPartition = ({ random, mu, sigma }: PartitionAreaOptions, area: Area): Tree.BinaryTree<Area> => {
  const HORIZONTAL = true;
  const VERTICAL = false;
  type Direction = typeof HORIZONTAL | typeof VERTICAL;

  const splitHorizontally = ({ x, y, width, height }: Area): [Area, Area] => {
    const split = Math.floor(
      Random.clamp(0, width, Random.unitPairToGaussianDistribution({ mu: mu * width, sigma }, random(), random()))
    );
    return [
      { x: x, y: y, width: split, height: height },
      {
        x: x + split,
        y: y,
        width: width - split,
        height: height,
      },
    ];
  };

  const splitVertically = ({ x, y, width, height }: Area): [Area, Area] => {
    const split = Math.floor(
      Random.clamp(0, height, Random.unitPairToGaussianDistribution({ mu: mu * height, sigma }, random(), random()))
    );
    return [
      { x: x, y: y, width: width, height: split },
      {
        x: x,
        y: y + split,
        width: width,
        height: height - split,
      },
    ];
  };

  const $partition = (direction: Direction, area: Area): Tree.BinaryTree<Area> => {
    if (area.width < 10 || area.height < 10) {
      return Tree.leafOf(area);
    }

    const split = direction === HORIZONTAL ? splitHorizontally : splitVertically;
    const [left, right] = split(area);

    const nextDirection = direction === HORIZONTAL ? VERTICAL : HORIZONTAL;
    return Tree.branchOf(area, $partition(nextDirection, left), $partition(nextDirection, right));
  };

  return $partition(HORIZONTAL, area);
};
