import React, { useCallback, useEffect, useRef } from "react";
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import RendererWebGLWorker from "worker-loader!./RendererWebGLWorker";
import { Dispatch } from "../utils/createDispatch";
import { useViewportListener } from "../utils/useViewportListener";

export const createRendererWorker = (): Worker => {
  return RendererWebGLWorker();
};

export const Renderer: React.FC<{ dispatch: Dispatch }> = ({ dispatch }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

  // Listen to panning and zoom on canvas
  const onViewportChange = useCallback(
    (dx, dy, zoom) => {
      dispatch({
        type: "SET_VIEWPORT",
        payload: {
          dx: dx * window.devicePixelRatio,
          dy: dy * window.devicePixelRatio,
          zoom: zoom * window.devicePixelRatio,
        },
      });
    },
    [dispatch]
  );
  useViewportListener(canvasRef, onViewportChange);

  // Canvas resize listener
  useEffect(() => {
    const resizeListener = () => {
      if (!canvasRef.current) {
        return;
      }
      // Offscreen canvas size cannot be changed by the main thread once transfered
      const { offsetWidth: width, offsetHeight: height } = canvasRef.current;
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
