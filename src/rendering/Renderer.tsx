import React, { useEffect, useRef } from "react";
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import RendererWebGLWorker from "worker-loader!./RendererWebGLWorker";
import * as Dungeon from "../generation/dungeon";

export const Renderer: React.FC<
  RendererProps & {
    dispatch: Dispatch;
  }
> = ({ dungeon, dispatch, dx, dy, zoom }) => {
  // Set the rendered dungeon
  useEffect(() => dispatch({ type: "SET_DUNGEON", payload: dungeon }), [dispatch, dungeon]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(
    () =>
      dispatch({
        type: "SET_VIEWPORT",
        payload: {
          dx: dx * window.devicePixelRatio,
          dy: dy * window.devicePixelRatio,
          zoom: zoom * window.devicePixelRatio,
        },
      }),
    [dispatch, dx, dy, zoom]
  );

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

type RendererProps = {
  dungeon: Dungeon.Dungeon;
  dx: number;
  dy: number;
  zoom: number;
};

const rendererWebGL: Worker = RendererWebGLWorker();
const dispatchWebGL = createDispatch(rendererWebGL);
export const RendererWebGL: React.FC<RendererProps> = (props) => {
  return <Renderer dispatch={dispatchWebGL} {...props} />;
};
