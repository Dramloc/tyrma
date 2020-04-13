import React, { useEffect, useRef } from "react";
import tileset from "./assets/dungeon-tileset.json";
import tilesetImage from "./assets/dungeon-tileset.png";
import * as Dungeon from "./dungeon";
import * as Grid from "./grid";
import * as Random from "./random";

type SliceBounds = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type SliceKey = {
  frame: number;
  bounds: SliceBounds;
};

type Slice = {
  name: string;
  color: string;
  keys: SliceKey[];
};

const loadTexture = (path: string): Promise<HTMLImageElement> => {
  const texture = new Image();
  texture.src = path;
  return new Promise((resolve, reject) => {
    texture.addEventListener("load", () => resolve(texture));
    texture.addEventListener("error", reject);
  });
};

const memoize = <T extends any[], U>(fn: (...args: T) => U) => {
  const cache: { [key: string]: U } = {};
  return (...args: T) => {
    const key = JSON.stringify(args);
    if (cache[key] !== undefined) {
      return cache[key];
    }
    const value = fn.call(null, ...args);
    cache[key] = value;
    return value;
  };
};

const getSlices = memoize((sliceName: string): Slice[] => {
  const slices: Slice[] = tileset.meta.slices;
  return slices.filter((slice) => {
    return slice.name.split("_")[0] === sliceName;
  });
});

const getBounds = memoize((sliceName: string, dx: number, dy: number): SliceBounds | null => {
  const random = Random.createGenerator(`${dx}.${dy}`);
  const slices = getSlices(sliceName);
  if (slices.length === 0) {
    return null;
  }
  const slice = slices[Math.floor(random() * slices.length)];
  const key = slice.keys.find((key) => key.frame === 0);
  if (key === undefined) {
    console.log(`${sliceName}.${0} not found.`);
    return null;
  }
  return key.bounds;
});

const drawImage = (
  slicePrefix: string,
  dx: number,
  dy: number,
  texture: HTMLImageElement,
  ctx: CanvasRenderingContext2D
): void => {
  const sliceBounds = getBounds(slicePrefix, dx, dy);
  if (sliceBounds === null) {
    console.log(`${slicePrefix} not found.`);
    return;
  }
  ctx.drawImage(
    texture,
    sliceBounds.x,
    sliceBounds.y,
    sliceBounds.w,
    sliceBounds.h,
    dx,
    dy,
    sliceBounds.w,
    sliceBounds.h
  );
};

const render = async (
  dungeon: Dungeon.Dungeon,
  ctx: CanvasRenderingContext2D,
  zoom: number,
  dx: number,
  dy: number
) => {
  const tilesetTexture = await loadTexture(tilesetImage);
  console.time("render");
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.translate(dx * devicePixelRatio, dy * devicePixelRatio);
  ctx.scale(devicePixelRatio * zoom, devicePixelRatio * zoom);
  Grid.mapWithCoordinates((value, x, y) => {
    if (value) {
      // Floor
      drawImage("floor", x * 16, y * 16, tilesetTexture, ctx);
      if (Grid.get(x - 1, y, dungeon.walls) === false && Grid.get(x, y - 1, dungeon.walls) === false) {
        drawImage("shadowout-north-west", x * 16, y * 16, tilesetTexture, ctx);
      }
      if (Grid.get(x - 1, y, dungeon.walls) === false && Grid.get(x, y - 1, dungeon.walls)) {
        if (Grid.get(x - 1, y - 1, dungeon.walls) === false) {
          if (Grid.get(x - 1, y - 2, dungeon.walls) === false) {
            drawImage("shadow-west", x * 16, y * 16, tilesetTexture, ctx);
          } else {
            drawImage("shadow-north-west-west", x * 16, y * 16, tilesetTexture, ctx);
          }
        }
      }
      if (Grid.get(x - 1, y, dungeon.walls) && Grid.get(x, y - 1, dungeon.walls) === false) {
        if (Grid.get(x - 1, y - 1, dungeon.walls) === false) {
          drawImage("shadow-north", x * 16, y * 16, tilesetTexture, ctx);
        } else {
          drawImage("shadow-north-north-west", x * 16, y * 16, tilesetTexture, ctx);
        }
      }
      if (
        Grid.get(x - 1, y - 1, dungeon.walls) === false &&
        Grid.get(x, y - 1, dungeon.walls) &&
        Grid.get(x - 1, y, dungeon.walls)
      ) {
        drawImage("shadowin-north-west", x * 16, y * 16, tilesetTexture, ctx);
      }
    } else {
      if (Grid.get(x, y + 1, dungeon.walls)) {
        // Wall front face
        // 🧱🧱🧱
        // ⬛⬛⬛
        drawImage("wall", x * 16, y * 16, tilesetTexture, ctx);
        if (
          (Grid.get(x - 1, y, dungeon.walls) === false && Grid.get(x - 1, y + 1, dungeon.walls) === false) ||
          Grid.get(x - 1, y, dungeon.walls)
        ) {
          // Wall front face west half if there is an adjacent wall to the west
          // 🧱🧱🧱 or ⬛🧱🧱
          // 🧱⬛⬛    ⬛⬛⬛
          drawImage("wall-west", x * 16, y * 16, tilesetTexture, ctx);
        }
        if (
          (Grid.get(x + 1, y, dungeon.walls) === false && Grid.get(x + 1, y + 1, dungeon.walls) === false) ||
          Grid.get(x + 1, y, dungeon.walls)
        ) {
          // Wall front face east half if there is an adjacent wall to the east
          // 🧱🧱🧱 or 🧱🧱⬛
          // ⬛⬛🧱    ⬛⬛⬛
          drawImage("wall-east", x * 16 + 8, y * 16, tilesetTexture, ctx);
        }
      } else {
        // Filled wall
        drawImage("wallfull", x * 16, y * 16, tilesetTexture, ctx);

        // North wall top
        if (Grid.get(x, y + 2, dungeon.walls)) {
          drawImage("walltop-north", x * 16, y * 16 + 8, tilesetTexture, ctx);
        }
        if (Grid.get(x, y + 2, dungeon.walls) && Grid.get(x + 1, y + 2, dungeon.walls) === false) {
          drawImage("walltop-north-north-east", x * 16 + 8, y * 16 + 8, tilesetTexture, ctx);
        }
        if (Grid.get(x, y + 2, dungeon.walls) && Grid.get(x - 1, y + 2, dungeon.walls) === false) {
          drawImage("walltop-north-north-west", x * 16, y * 16 + 8, tilesetTexture, ctx);
        }

        // East wall top
        if (Grid.get(x - 1, y, dungeon.walls) || Grid.get(x - 1, y + 1, dungeon.walls)) {
          drawImage("walltop-east", x * 16, y * 16, tilesetTexture, ctx);
        }
        if (Grid.get(x - 1, y, dungeon.walls) && Grid.get(x - 1, y + 1, dungeon.walls) === false) {
          drawImage("walltop-south-east-east", x * 16, y * 16 + 8, tilesetTexture, ctx);
        }
        if (Grid.get(x - 1, y + 1, dungeon.walls) && Grid.get(x - 1, y, dungeon.walls) === false) {
          drawImage("walltop-north-east-east", x * 16, y * 16, tilesetTexture, ctx);
        }

        // West wall top
        if (Grid.get(x + 1, y, dungeon.walls) || Grid.get(x + 1, y + 1, dungeon.walls)) {
          drawImage("walltop-west", x * 16 + 8, y * 16, tilesetTexture, ctx);
        }
        if (Grid.get(x + 1, y, dungeon.walls) && Grid.get(x + 1, y + 1, dungeon.walls) === false) {
          drawImage("walltop-south-west-west", x * 16 + 8, y * 16 + 8, tilesetTexture, ctx);
        }
        if (Grid.get(x + 1, y + 1, dungeon.walls) && Grid.get(x + 1, y, dungeon.walls) === false) {
          drawImage("walltop-north-west-west", x * 16 + 8, y * 16, tilesetTexture, ctx);
        }

        // South wall top
        if (Grid.get(x, y - 1, dungeon.walls)) {
          drawImage("walltop-south", x * 16, y * 16, tilesetTexture, ctx);
        }
        if (Grid.get(x, y - 1, dungeon.walls) && Grid.get(x + 1, y - 1, dungeon.walls) === false) {
          drawImage("walltop-south-south-east", x * 16 + 8, y * 16, tilesetTexture, ctx);
        }
        if (Grid.get(x, y - 1, dungeon.walls) && Grid.get(x - 1, y - 1, dungeon.walls) === false) {
          drawImage("walltop-south-south-west", x * 16, y * 16, tilesetTexture, ctx);
        }

        if (
          Grid.get(x - 1, y + 2, dungeon.walls) &&
          Grid.get(x - 1, y + 1, dungeon.walls) === false &&
          Grid.get(x, y + 1, dungeon.walls) === false &&
          Grid.get(x, y + 2, dungeon.walls) === false &&
          Grid.get(x - 1, y, dungeon.walls) === false
        ) {
          drawImage("walltopcornerout-north-east", x * 16, y * 16 + 8, tilesetTexture, ctx);
        }
        if (
          Grid.get(x + 1, y + 2, dungeon.walls) &&
          Grid.get(x + 1, y + 1, dungeon.walls) === false &&
          Grid.get(x, y + 1, dungeon.walls) === false &&
          Grid.get(x, y + 2, dungeon.walls) === false &&
          Grid.get(x + 1, y, dungeon.walls) === false
        ) {
          drawImage("walltopcornerout-north-west", x * 16 + 8, y * 16 + 8, tilesetTexture, ctx);
        }
        if (
          Grid.get(x - 1, y - 1, dungeon.walls) &&
          Grid.get(x, y - 1, dungeon.walls) === false &&
          Grid.get(x - 1, y, dungeon.walls) === false
        ) {
          drawImage("walltopcornerout-south-east", x * 16, y * 16, tilesetTexture, ctx);
        }
        if (
          Grid.get(x + 1, y - 1, dungeon.walls) &&
          Grid.get(x, y - 1, dungeon.walls) === false &&
          Grid.get(x + 1, y, dungeon.walls) === false
        ) {
          drawImage("walltopcornerout-south-west", x * 16 + 8, y * 16, tilesetTexture, ctx);
        }

        if (Grid.get(x, y + 2, dungeon.walls) && Grid.get(x + 1, y + 1, dungeon.walls)) {
          drawImage("walltopcornerin-north-west", x * 16 + 8, y * 16 + 8, tilesetTexture, ctx);
        }

        if (Grid.get(x, y + 2, dungeon.walls) && Grid.get(x - 1, y + 1, dungeon.walls)) {
          drawImage("walltopcornerin-north-east", x * 16, y * 16 + 8, tilesetTexture, ctx);
        }

        if (Grid.get(x, y - 1, dungeon.walls) && Grid.get(x + 1, y, dungeon.walls)) {
          drawImage("walltopcornerin-south-west", x * 16 + 8, y * 16, tilesetTexture, ctx);
        }

        if (Grid.get(x, y - 1, dungeon.walls) && Grid.get(x - 1, y, dungeon.walls)) {
          drawImage("walltopcornerin-south-east", x * 16, y * 16, tilesetTexture, ctx);
        }
      }
    }
  }, dungeon.walls);
  ctx.restore();
  console.timeEnd("render");
};

export const Renderer2D: React.FC<{ dungeon: Dungeon.Dungeon; zoom: number; dx: number; dy: number }> = ({
  dungeon,
  zoom,
  dx,
  dy,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const width = dungeon.walls.width * 16;
  const height = dungeon.walls.height * 16;
  useEffect(() => {
    if (canvasRef.current !== null) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        render(dungeon, ctx, zoom, dx, dy);
      }
    }
  }, [dungeon, dx, dy, zoom]);
  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      width={width * devicePixelRatio}
      height={height * devicePixelRatio}
    />
  );
};
