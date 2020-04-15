import React, { useEffect, useRef } from "react";
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import worker from "worker-loader!./RendererWorker";
import * as Dungeon from "./dungeon";
import { useViewport } from "./useViewport";

const instance = worker();

export const Renderer: React.FC<{
  dungeon: Dungeon.Dungeon;
}> = ({ dungeon }) => {
  // Set the rendered dungeon
  useEffect(() => instance.postMessage({ type: "SET_DUNGEON", payload: dungeon }), [dungeon]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { zoom, dx, dy } = useViewport(canvasRef);
  useEffect(() => instance.postMessage({ type: "SET_ZOOM", payload: zoom * window.devicePixelRatio }), [zoom]);

  useEffect(() => {
    instance.postMessage({ type: "SET_DX", payload: dx * window.devicePixelRatio });
  }, [dx]);

  useEffect(() => {
    instance.postMessage({ type: "SET_DY", payload: dy * window.devicePixelRatio });
  }, [dy]);

  // Worker initialization
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

  // Canvas resize listener
  useEffect(() => {
    const resizeListener = () => {
      if (!canvasRef.current) {
        return;
      }
      // Offscreen canvas size cannot be changed by the main thread once transfered
      const { width, height } = canvasRef.current.getBoundingClientRect();
      instance.postMessage({
        type: "SET_SIZE",
        payload: { width: width * devicePixelRatio, height: height * devicePixelRatio },
      });
    };
    resizeListener();
    window.addEventListener("resize", resizeListener);
    return () => window.removeEventListener("resize", resizeListener);
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};
