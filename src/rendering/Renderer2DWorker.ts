/* eslint-env browser, worker */
import tilesetImage from "../assets/dungeon-tileset.png";
import * as Dungeon from "../generation/dungeon";
import * as Grid from "../utils/grid";
import { getDrawImageOperations } from "./cell";
import { getBounds, loadTexture } from "./texture";

const renderCell = (tilesetTexture: ImageBitmap, ctx: OffscreenCanvasRenderingContext2D, dungeon: Dungeon.Dungeon) => {
  const renderCellWithContext = (value: boolean, x: number, y: number): void => {
    getDrawImageOperations(x, y, dungeon.walls).forEach(([sliceName, dx, dy]) => {
      const sliceBounds = getBounds(sliceName, x * 16 + dx, y * 16 + dy);
      ctx.drawImage(
        tilesetTexture,
        sliceBounds.x,
        sliceBounds.y,
        sliceBounds.w,
        sliceBounds.h,
        x * 16 + dx,
        y * 16 + dy,
        sliceBounds.w,
        sliceBounds.h
      );
    });
  };
  return renderCellWithContext;
};

const render = (
  ctx: OffscreenCanvasRenderingContext2D,
  dungeon: Dungeon.Dungeon,
  dx: number,
  dy: number,
  zoom: number,
  tilesetTexture: ImageBitmap
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.translate(dx, dy);
  ctx.scale(zoom, zoom);
  const $renderCell = renderCell(tilesetTexture, ctx, dungeon);
  Grid.forEachWithCoordinates($renderCell, dungeon.walls);
  ctx.restore();
};

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;

let dx = 0;
let dy = 0;
let zoom = 0;
let dungeon: Dungeon.Dungeon | null = null;
let animationFrame: number | null = null;

const startAnimate = async (ctx: OffscreenCanvasRenderingContext2D, dungeon: Dungeon.Dungeon) => {
  const tilesetTexture = await loadTexture(tilesetImage);
  const animate = () => {
    animationFrame = requestAnimationFrame(animate);
    render(ctx, dungeon, dx, dy, zoom, tilesetTexture);
  };
  animate();
};

globalThis.addEventListener("message", (e) => {
  const action = e.data;
  switch (action.type) {
    case "SETUP": {
      canvas = action.payload as OffscreenCanvas;
      ctx = canvas.getContext("2d");
      if (dungeon === null || ctx === null) {
        return;
      }
      startAnimate(ctx, dungeon);
      break;
    }
    case "TEARDOWN": {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
      break;
    }
    case "SET_DUNGEON": {
      dungeon = action.payload as Dungeon.Dungeon;
      break;
    }
    case "SET_VIEWPORT": {
      dx = action.payload.dx;
      dy = action.payload.dy;
      zoom = action.payload.zoom;
      break;
    }
    case "SET_SIZE": {
      const { width, height } = action.payload;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
    }
  }
});
