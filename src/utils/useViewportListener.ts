import { useCallback, useEffect, useRef } from "react";

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

export const useViewportListener = <T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  onChange: (dx: number, dy: number, zoom: number) => void
) => {
  const zoom = useRef(1);
  const dx = useRef(0);
  const dy = useRef(0);

  useEffect(() => {
    onChange(dx.current, dy.current, zoom.current);
  }, [onChange]);

  const onMouseWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const deltaZoom = e.deltaY < 0 ? +1 : -1;
      const nextZoom = Math.max(1, zoom.current + deltaZoom);
      if (nextZoom === zoom.current) {
        return;
      }
      const mouseX = e.offsetX;
      const mouseY = e.offsetY;
      const nextDx = mouseX - (mouseX - dx.current) * (nextZoom / zoom.current);
      const nextDy = mouseY - (mouseY - dy.current) * (nextZoom / zoom.current);

      dx.current = Math.floor(nextDx);
      dy.current = Math.floor(nextDy);
      zoom.current = nextZoom;
      onChange(dx.current, dy.current, zoom.current);
    },
    [onChange]
  );
  useEventListener("wheel", onMouseWheel, ref);

  const start = useRef<{ x: number; y: number } | null>(null);
  // Handle panning start
  const onPanningStart = useCallback(
    (e: { clientX: number; clientY: number }) => {
      start.current = { x: e.clientX - dx.current, y: e.clientY - dy.current };
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
  const onPanningMove = useCallback(
    (e: { clientX: number; clientY: number }) => {
      if (start.current === null) {
        return;
      }
      dx.current = e.clientX - start.current.x;
      dy.current = e.clientY - start.current.y;
      onChange(dx.current, dy.current, zoom.current);
    },
    [onChange]
  );
  const onTouchPanning = useCallback(
    (e: TouchEvent) => {
      onPanningMove(e.touches[0]);
    },
    [onPanningMove]
  );
  useEventListener("mousemove", onPanningMove, ref);
  useEventListener("touchmove", onTouchPanning, ref);
};
