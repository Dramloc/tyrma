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
  useEffect(() => {
    instance.postMessage({ type: "SET_DPR", payload: window.devicePixelRatio });
  }, []);

  useEffect(() => {
    instance.postMessage({ type: "SET_DUNGEON", payload: dungeon });
  }, [dungeon]);

  useEffect(() => {
    instance.postMessage({ type: "SET_ZOOM", payload: zoom * window.devicePixelRatio });
  }, [zoom]);

  useEffect(() => {
    instance.postMessage({ type: "SET_DX", payload: dx * window.devicePixelRatio });
  }, [dx]);

  useEffect(() => {
    instance.postMessage({ type: "SET_DY", payload: dy * window.devicePixelRatio });
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
