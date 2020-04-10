import * as Dungeon from "./dungeon";
import * as Grid from "./grid";

export type RenderOptions = { wall: string; space: string };
export const render = ({ wall, space }: RenderOptions, dungeon: Dungeon.Dungeon): string => {
  return Grid.inspect(Grid.map((value) => (value === true ? space : wall), dungeon.walls));
};
