import React, { useEffect, useRef } from "react";
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import worker from "worker-loader!./RendererWorker";
import * as Dungeon from "./dungeon";

const instance = worker();

export const Renderer: React.FC<{ dungeon: Dungeon.Dungeon; zoom: number; dx: number; dy: number }> = ({
  dungeon,
  zoom,
  dx,
  dy,
}) => {
  const width = dungeon.walls.width * 16;
  const height = dungeon.walls.height * 16;

  useEffect(() => {
    instance.postMessage({ type: "SET_DPR", payload: window.devicePixelRatio });
  }, []);

  useEffect(() => {
    instance.postMessage({ type: "SET_DUNGEON", payload: dungeon });
  }, [dungeon]);

  useEffect(() => {
    instance.postMessage({ type: "SET_ZOOM", payload: zoom });
  }, [zoom]);

  useEffect(() => {
    instance.postMessage({ type: "SET_DX", payload: dx });
  }, [dx]);

  useEffect(() => {
    instance.postMessage({ type: "SET_DY", payload: dy });
  }, [dy]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }
    const offscreen = canvasRef.current.transferControlToOffscreen();
    instance.postMessage({ type: "SETUP", payload: offscreen }, [offscreen]);
    return () => {
      instance.postMessage({ type: "TEARDOWN" });
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      // Offscreen canvas size cannot be changed by the main thread once transfered
      // This only sets the initial canvas size, subsequent updates are handle in the web worker
      width={width * devicePixelRatio}
      height={height * devicePixelRatio}
    />
  );
};
