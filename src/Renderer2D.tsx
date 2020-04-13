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

const memoize = <T extends any[], U>(fn: (...args: T) => U) => {
  const cache: { [key: string]: U } = {};
  const memoized = (...args: T) => {
    const key = JSON.stringify(args);
    if (cache[key] !== undefined) {
      return cache[key];
    }
    const value = fn(...args);
    cache[key] = value;
    return value;
  };
  return memoized;
};

const loadTexture = (path: string): Promise<HTMLImageElement> => {
  const texture = new Image();
  texture.src = path;
  return new Promise((resolve, reject) => {
    texture.addEventListener("load", () => resolve(texture));
    texture.addEventListener("error", reject);
  });
};

const getSlicesBounds = memoize((sliceName: string): SliceBounds[] => {
  const slices: Slice[] = tileset.meta.slices;
  return slices
    .filter((slice) => {
      return slice.name.split("_")[0] === sliceName;
    })
    .map((slice) => slice.keys[0])
    .filter((key) => key !== undefined)
    .map((key) => key.bounds);
});

const getBounds = (sliceName: string, dx: number, dy: number): SliceBounds | null => {
  const random = Random.createGenerator(`${dx}.${dy}`);
  const slicesBounds = getSlicesBounds(sliceName);
  if (slicesBounds.length === 0) {
    return null;
  }
  return slicesBounds[Math.floor(random() * slicesBounds.length)];
};

const drawImage = (
  texture: HTMLImageElement,
  ctx: CanvasRenderingContext2D,
  slicePrefix: string,
  dx: number,
  dy: number
): void => {
  const sliceBounds = getBounds(slicePrefix, dx, dy);
  if (sliceBounds === null) {
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

const packNeighboors = (
  northNorthWest: boolean,
  northNorth: boolean,
  northNorthEast: boolean,
  northWest: boolean,
  north: boolean,
  northEast: boolean,
  west: boolean,
  value: boolean,
  east: boolean,
  southWest: boolean,
  south: boolean,
  southEast: boolean,
  southSouthWest: boolean,
  southSouth: boolean,
  southSouthEast: boolean
): number => {
  return (
    // @ts-ignore
    northNorthWest |
    // @ts-ignore
    (northNorth << 1) |
    // @ts-ignore
    (northNorthEast << 2) |
    // @ts-ignore
    (northWest << 3) |
    // @ts-ignore
    (north << 4) |
    // @ts-ignore
    (northEast << 5) |
    // @ts-ignore
    (west << 6) |
    // @ts-ignore
    (value << 7) |
    // @ts-ignore
    (east << 8) |
    // @ts-ignore
    (southWest << 9) |
    // @ts-ignore
    (south << 10) |
    // @ts-ignore
    (southEast << 11) |
    // @ts-ignore
    (southSouthWest << 12) |
    // @ts-ignore
    (southSouth << 13) |
    // @ts-ignore
    (southSouthEast << 14)
  );
};

const getDrawImageOperations = memoize((neighboors: number): [string, number, number][] => {
  const drawImageOperations: [string, number, number][] = [];
  const northNorthWest = neighboors & 1;
  const northWest = neighboors & (1 << 3);
  const north = neighboors & (1 << 4);
  const northEast = neighboors & (1 << 5);
  const west = neighboors & (1 << 6);
  const value = neighboors & (1 << 7);
  const east = neighboors & (1 << 8);
  const southWest = neighboors & (1 << 9);
  const south = neighboors & (1 << 10);
  const southEast = neighboors & (1 << 11);
  const southSouthWest = neighboors & (1 << 12);
  const southSouth = neighboors & (1 << 13);
  const southSouthEast = neighboors & (1 << 14);

  if (value) {
    // Floor
    drawImageOperations.push(["floor", 0, 0]);
    if (!west && !north) {
      drawImageOperations.push(["shadowout-north-west", 0, 0]);
    }
    if (!west && north) {
      if (!northWest) {
        if (!northNorthWest) {
          drawImageOperations.push(["shadow-west", 0, 0]);
        } else {
          drawImageOperations.push(["shadow-north-west-west", 0, 0]);
        }
      }
    }
    if (west && !north) {
      if (!northWest) {
        drawImageOperations.push(["shadow-north", 0, 0]);
      } else {
        drawImageOperations.push(["shadow-north-north-west", 0, 0]);
      }
    }
    if (!northWest && north && west) {
      drawImageOperations.push(["shadowin-north-west", 0, 0]);
    }
  } else {
    if (south) {
      // Wall front face
      // 🧱🧱🧱
      // ⬛⬛⬛
      drawImageOperations.push(["wall", 0, 0]);
      if ((!west && !southWest) || west) {
        // Wall front face west half if there is an adjacent wall to the west
        // 🧱🧱🧱 or ⬛🧱🧱
        // 🧱⬛⬛    ⬛⬛⬛
        drawImageOperations.push(["wall-west", 0, 0]);
      }
      if ((!east && !southEast) || east) {
        // Wall front face east half if there is an adjacent wall to the east
        // 🧱🧱🧱 or 🧱🧱⬛
        // ⬛⬛🧱    ⬛⬛⬛
        drawImageOperations.push(["wall-east", 8, 0]);
      }
    } else {
      // Filled wall
      drawImageOperations.push(["wallfull", 0, 0]);

      // North wall top
      if (southSouth) {
        drawImageOperations.push(["walltop-north", 0, 8]);
      }
      if (southSouth && !southSouthEast) {
        drawImageOperations.push(["walltop-north-north-east", 8, 8]);
      }
      if (southSouth && !southSouthWest) {
        drawImageOperations.push(["walltop-north-north-west", 0, 8]);
      }

      // East wall top
      if (west || southWest) {
        drawImageOperations.push(["walltop-east", 0, 0]);
      }
      if (west && !southWest) {
        drawImageOperations.push(["walltop-south-east-east", 0, 8]);
      }
      if (southWest && !west) {
        drawImageOperations.push(["walltop-north-east-east", 0, 0]);
      }

      // West wall top
      if (east || southEast) {
        drawImageOperations.push(["walltop-west", 8, 0]);
      }
      if (east && !southEast) {
        drawImageOperations.push(["walltop-south-west-west", 8, 8]);
      }
      if (southEast && !east) {
        drawImageOperations.push(["walltop-north-west-west", 8, 0]);
      }

      // South wall top
      if (north) {
        drawImageOperations.push(["walltop-south", 0, 0]);
      }
      if (north && !northEast) {
        drawImageOperations.push(["walltop-south-south-east", 8, 0]);
      }
      if (north && !northWest) {
        drawImageOperations.push(["walltop-south-south-west", 0, 0]);
      }

      if (southSouthWest && !southWest && !south && !southSouth && !west) {
        drawImageOperations.push(["walltopcornerout-north-east", 0, 8]);
      }
      if (southSouthEast && !southEast && !south && !southSouth && !east) {
        drawImageOperations.push(["walltopcornerout-north-west", 8, 8]);
      }
      if (northWest && !north && !west) {
        drawImageOperations.push(["walltopcornerout-south-east", 0, 0]);
      }
      if (northEast && !north && !east) {
        drawImageOperations.push(["walltopcornerout-south-west", 8, 0]);
      }

      if (southSouth && southEast) {
        drawImageOperations.push(["walltopcornerin-north-west", 8, 8]);
      }

      if (southSouth && southWest) {
        drawImageOperations.push(["walltopcornerin-north-east", 0, 8]);
      }

      if (north && east) {
        drawImageOperations.push(["walltopcornerin-south-west", 8, 0]);
      }

      if (north && west) {
        drawImageOperations.push(["walltopcornerin-south-east", 0, 0]);
      }
    }
  }
  return drawImageOperations;
});

const renderCell = (tilesetTexture: HTMLImageElement, ctx: CanvasRenderingContext2D, dungeon: Dungeon.Dungeon) => {
  const renderCellWithContext = (value: boolean, x: number, y: number): void => {
    const north = Grid.get(x, y - 1, dungeon.walls);
    const northNorthWest = Grid.get(x - 1, y - 2, dungeon.walls);
    const northWest = Grid.get(x - 1, y - 1, dungeon.walls);
    const west = Grid.get(x - 1, y, dungeon.walls);
    const southWest = Grid.get(x - 1, y + 1, dungeon.walls);
    const southSouthWest = Grid.get(x - 1, y + 2, dungeon.walls);
    const south = Grid.get(x, y + 1, dungeon.walls);
    const southSouth = Grid.get(x, y + 2, dungeon.walls);
    const southSouthEast = Grid.get(x + 1, y + 2, dungeon.walls);
    const southEast = Grid.get(x + 1, y + 1, dungeon.walls);
    const east = Grid.get(x + 1, y, dungeon.walls);
    const northEast = Grid.get(x + 1, y - 1, dungeon.walls);
    const northNorthEast = Grid.get(x + 1, y - 2, dungeon.walls);
    const northNorth = Grid.get(x, y - 2, dungeon.walls);
    const neighboors = packNeighboors(
      northNorthWest,
      northNorth,
      northNorthEast,
      northWest,
      north,
      northEast,
      west,
      value,
      east,
      southWest,
      south,
      southEast,
      southSouthWest,
      southSouth,
      southSouthEast
    );
    getDrawImageOperations(neighboors).forEach(([sliceName, dx, dy]) =>
      drawImage(tilesetTexture, ctx, sliceName, x * 16 + dx, y * 16 + dy)
    );
  };
  return renderCellWithContext;
};

const textureCache: { [key: string]: HTMLImageElement } = {};

const render = (dungeon: Dungeon.Dungeon, ctx: CanvasRenderingContext2D, zoom: number, dx: number, dy: number) => {
  let tilesetTexture = null;
  if (textureCache[tilesetImage] !== undefined) {
    tilesetTexture = textureCache[tilesetImage];
  } else {
    loadTexture(tilesetImage).then((tilesetTexture) => {
      textureCache[tilesetImage] = tilesetTexture;
    });
    return;
  }
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.translate(dx * devicePixelRatio, dy * devicePixelRatio);
  ctx.scale(devicePixelRatio * zoom, devicePixelRatio * zoom);
  const $renderCell = renderCell(tilesetTexture, ctx, dungeon);
  Grid.forEachWithCoordinates($renderCell, dungeon.walls);
  ctx.restore();
};

export const Renderer2D: React.FC<{ dungeon: Dungeon.Dungeon; zoom: number; dx: number; dy: number }> = ({
  dungeon,
  zoom,
  dx,
  dy,
}) => {
  const width = dungeon.walls.width * 16;
  const height = dungeon.walls.height * 16;

  const dungeonRef = useRef(dungeon);
  useEffect(() => {
    dungeonRef.current = dungeon;
  }, [dungeon]);

  const zoomRef = useRef(zoom);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  const dxRef = useRef(dx);
  useEffect(() => {
    dxRef.current = dx;
  }, [dx]);

  const dyRef = useRef(dy);
  useEffect(() => {
    dyRef.current = dy;
  }, [dy]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  useEffect(() => {
    if (canvasRef.current !== null) {
      const ctx = canvasRef.current.getContext("2d");
      contextRef.current = ctx;
    }
  }, [dungeon, dx, dy, zoom]);

  useEffect(() => {
    const animate = () => {
      animationFrame = window.requestAnimationFrame(animate);
      if (contextRef.current !== null) {
        render(dungeonRef.current, contextRef.current, zoomRef.current, dxRef.current, dyRef.current);
      }
    };
    let animationFrame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      width={width * devicePixelRatio}
      height={height * devicePixelRatio}
    />
  );
};
