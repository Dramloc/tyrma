import tileset from "../assets/dungeon-tileset.json";
import { invariant } from "../utils/invariant";
import { memoize } from "../utils/memoize";
import * as Random from "../utils/random";

export const loadTexture = async (path: string): Promise<ImageBitmap> => {
  const response = await fetch(path);
  const blob = await response.blob();
  const image = await createImageBitmap(blob);
  return image;
};

type SliceBounds = {
  x: number;
  y: number;
  w: number;
  h: number;
};

const getSlicesBounds = memoize((sliceName: string): SliceBounds[] => {
  return tileset.meta.slices
    .filter((slice) => {
      return slice.name.split("_")[0] === sliceName;
    })
    .map((slice) => slice.keys[0])
    .filter((key) => key !== undefined)
    .map((key) => key.bounds);
});

export const getBounds = (sliceName: string, dx: number, dy: number): SliceBounds | never => {
  const slicesBounds = getSlicesBounds(sliceName);
  invariant(slicesBounds.length !== 0, "Unknown slice `%s`.", sliceName);

  const random = Random.createGenerator(`${dx}.${dy}`);
  return slicesBounds[Math.floor(random() * slicesBounds.length)];
};
