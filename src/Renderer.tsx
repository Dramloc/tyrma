import React, { useEffect, useRef } from "react";
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import Renderer2DWorker from "worker-loader!./Renderer2DWorker";
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import RendererWebGLWorker from "worker-loader!./RendererWebGLWorker";
import * as Dungeon from "./dungeon";
import { useViewport } from "./useViewport";

export const Renderer: React.FC<{
  dungeon: Dungeon.Dungeon;
  dispatch: Dispatch;
}> = ({ dungeon, dispatch }) => {
  // Set the rendered dungeon
  useEffect(() => dispatch({ type: "SET_DUNGEON", payload: dungeon }), [dispatch, dungeon]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Listen for panning and zoom on the canvas
  const { zoom, dx, dy } = useViewport(canvasRef);
  useEffect(() => dispatch({ type: "SET_ZOOM", payload: zoom * window.devicePixelRatio }), [dispatch, zoom]);
  useEffect(() => dispatch({ type: "SET_DX", payload: dx * window.devicePixelRatio }), [dispatch, dx]);
  useEffect(() => dispatch({ type: "SET_DY", payload: dy * window.devicePixelRatio }), [dispatch, dy]);

  // Worker initialization
  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }
    const offscreen = canvasRef.current.transferControlToOffscreen();
    dispatch({ type: "SETUP", payload: offscreen }, [offscreen]);
    return () => {
      dispatch({ type: "TEARDOWN" });
    };
  }, [dispatch]);

  // Canvas resize listener
  useEffect(() => {
    const resizeListener = () => {
      if (!canvasRef.current) {
        return;
      }
      // Offscreen canvas size cannot be changed by the main thread once transfered
      const { width, height } = canvasRef.current.getBoundingClientRect();
      dispatch({
        type: "SET_SIZE",
        payload: { width: width * devicePixelRatio, height: height * devicePixelRatio },
      });
    };
    resizeListener();
    window.addEventListener("resize", resizeListener);
    return () => window.removeEventListener("resize", resizeListener);
  }, [dispatch]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};

type Dispatch = (action: { type: string; payload?: any }, transfer?: Transferable[]) => void;

const createDispatch = (worker: Worker): Dispatch => {
  const dispatch = (action: { type: string; payload?: any }, transfer: Transferable[] = []) => {
    worker.postMessage(action, transfer);
  };
  return dispatch;
};

const renderer2D: Worker = Renderer2DWorker();
const dispatch2D = createDispatch(renderer2D);
export const Renderer2D: React.FC<{ dungeon: Dungeon.Dungeon }> = ({ dungeon }) => {
  return <Renderer dungeon={dungeon} dispatch={dispatch2D} />;
};

const rendererWebGL: Worker = RendererWebGLWorker();
const dispatchWebGL = createDispatch(rendererWebGL);
export const RendererWebGL: React.FC<{ dungeon: Dungeon.Dungeon }> = ({ dungeon }) => {
  return <Renderer dungeon={dungeon} dispatch={dispatchWebGL} />;
};
