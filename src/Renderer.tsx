import React, { forwardRef, useEffect, useRef, useState } from "react";
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import worker from "worker-loader!./RendererWorker";
import * as Dungeon from "./dungeon";

const instance = worker();

export const Renderer = forwardRef<
  HTMLCanvasElement | null,
  {
    dungeon: Dungeon.Dungeon;
  }
>(({ dungeon }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Zoom listener
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return undefined;
    }
    const listener = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        setZoom((zoom) => Math.max(1, zoom - 1));
      } else {
        setZoom((zoom) => zoom + 1);
      }
    };
    canvas.addEventListener("wheel", listener);
    return () => canvas.removeEventListener("wheel", listener);
  });

  // Panning listeners
  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);
  const start = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return undefined;
    }
    const handleStart = (location: { clientX: number; clientY: number }) => {
      start.current = { x: location.clientX - dx, y: location.clientY - dy };
    };
    const onMouseDownListener = (e: MouseEvent) => {
      handleStart(e);
      canvas.style.cursor = "move";
    };
    const onTouchStartListener = (e: TouchEvent) => {
      handleStart(e.touches[0]);
    };
    canvas.addEventListener("mousedown", onMouseDownListener);
    canvas.addEventListener("touchstart", onTouchStartListener);
    return () => {
      canvas.removeEventListener("mousedown", onMouseDownListener);
      canvas.removeEventListener("touchstart", onTouchStartListener);
    };
  }, [dx, dy]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return undefined;
    }
    const onMouseUpListener = () => {
      start.current = null;
      canvas.style.cursor = "default";
    };
    canvas.addEventListener("mouseup", onMouseUpListener);
    canvas.addEventListener("mouseleave", onMouseUpListener);
    canvas.addEventListener("touchend", onMouseUpListener);
    return () => {
      canvas.removeEventListener("mouseup", onMouseUpListener);
      canvas.removeEventListener("mouseleave", onMouseUpListener);
      canvas.removeEventListener("touchend", onMouseUpListener);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return undefined;
    }
    const handleMove = (location: { clientX: number; clientY: number }) => {
      if (start.current === null) {
        return;
      }
      setDx(location.clientX - start.current.x);
      setDy(location.clientY - start.current.y);
    };
    const onMouseMoveListener = (e: MouseEvent) => {
      handleMove(e);
    };
    const onTouchMoveListener = (e: TouchEvent) => {
      handleMove(e.touches[0]);
    };
    canvas.addEventListener("mousemove", onMouseMoveListener);
    canvas.addEventListener("touchmove", onTouchMoveListener);
    return () => {
      canvas.removeEventListener("mousemove", onMouseMoveListener);
      canvas.removeEventListener("touchmove", onTouchMoveListener);
    };
  }, []);

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

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }
    const offscreen = canvasRef.current.transferControlToOffscreen();
    instance.postMessage({ type: "SETUP", payload: offscreen }, [offscreen]);
    return () => {
      instance.postMessage({ type: "TEARDOWN" });
    };
  }, [canvasRef]);

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
  }, [canvasRef]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
});
