import { useCallback, useEffect, useRef, useState } from "react";

const useEventListener = <T extends HTMLElement, K extends keyof HTMLElementEventMap>(
  type: K,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  ref: React.RefObject<T | null>,
  options?: boolean | AddEventListenerOptions
) => {
  useEffect(() => {
    const element = ref.current;
    if (element === null) {
      return;
    }
    element.addEventListener(type, listener, options);
    return () => element.removeEventListener(type, listener);
  }, [type, listener, options, ref]);
};

export const useViewport = <T extends HTMLElement>(ref: React.RefObject<T | null>) => {
  const [zoom, setZoom] = useState(1);
  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);

  const onMouseWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const deltaZoom = e.deltaY < 0 ? +1 : -1;
      const nextZoom = Math.max(1, zoom + deltaZoom);
      if (nextZoom === zoom) {
        return;
      }
      const mouseX = e.offsetX;
      const mouseY = e.offsetY;
      const nextDx = mouseX - (mouseX - dx) * (nextZoom / zoom);
      const nextDy = mouseY - (mouseY - dy) * (nextZoom / zoom);
      setZoom(nextZoom);
      setDx(Math.floor(nextDx));
      setDy(Math.floor(nextDy));
    },
    [dx, dy, zoom]
  );
  useEventListener("wheel", onMouseWheel, ref);

  const start = useRef<{ x: number; y: number } | null>(null);
  // Handle panning start
  const onPanningStart = useCallback(
    (e: { clientX: number; clientY: number }) => {
      start.current = { x: e.clientX - dx, y: e.clientY - dy };
      const element = ref.current;
      if (element !== null) {
        element.style.cursor = "move";
      }
    },
    [dx, dy, ref]
  );
  const onTouchPanningStart = useCallback(
    (e: TouchEvent) => {
      onPanningStart(e.touches[0]);
    },
    [onPanningStart]
  );
  useEventListener("mousedown", onPanningStart, ref);
  useEventListener("touchstart", onTouchPanningStart, ref);

  // Handle panning end
  const onPanningEnd = useCallback(() => {
    start.current = null;
    const element = ref.current;
    if (element !== null) {
      element.style.cursor = "default";
    }
  }, [ref]);
  useEventListener("mouseup", onPanningEnd, ref);
  useEventListener("mouseleave", onPanningEnd, ref);
  useEventListener("touchend", onPanningEnd, ref);
  useEventListener("touchcancel", onPanningEnd, ref);

  // Handle element panning
  const onPanningMove = useCallback((e: { clientX: number; clientY: number }) => {
    if (start.current === null) {
      return;
    }
    setDx(e.clientX - start.current.x);
    setDy(e.clientY - start.current.y);
  }, []);
  const onTouchPanning = useCallback(
    (e: TouchEvent) => {
      onPanningMove(e.touches[0]);
    },
    [onPanningMove]
  );
  useEventListener("mousemove", onPanningMove, ref);
  useEventListener("touchmove", onTouchPanning, ref);

  return {
    zoom,
    dx,
    dy,
  };
};
