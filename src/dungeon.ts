import * as Random from "./random";
import * as Walls from "./walls";

export type DungeonOptions = {
  seed: string;
  width: number;
  height: number;
  walls: Omit<Walls.WallsOptions, "random" | "width" | "height">;
};
export type Dungeon = { walls: Walls.Walls };

export const generate = (options: DungeonOptions): Dungeon => {
  const random = Random.createGenerator(options.seed);
  const walls = Walls.generate({ random, ...options, ...options.walls });
  return {
    walls,
  };
};
