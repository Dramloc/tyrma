import { css, Global } from "@emotion/core";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfigurationEditor, getDefaultConfiguration, Specification } from "./ConfigurationEditor";
import * as Dungeon from "./dungeon";
import { Renderer } from "./Renderer";

const configurationSpecification: Specification<Dungeon.DungeonOptions> = {
  seed: {
    type: "text",
    default: "1234",
  },
  width: {
    type: "number",
    min: 0,
    default: 80,
  },
  height: {
    type: "number",
    min: 0,
    default: 40,
  },
  walls: {
    type: {
      partition: {
        type: {
          mu: {
            type: "number",
            min: 0.05,
            default: 0.5,
            max: 0.95,
            step: 0.05,
          },
          sigma: {
            type: "number",
            default: 0.5,
            min: 0,
            step: 0.1,
          },
        },
      },
      padding: {
        type: {
          mu: {
            type: "number",
            default: 0.2,
            step: 0.05,
          },
          sigma: {
            type: "number",
            default: 1,
            min: 0,
            step: 0.1,
          },
        },
      },
    },
  },
};

export const App = () => {
  const [configuration, setConfiguration] = useState<Dungeon.DungeonOptions>(() =>
    getDefaultConfiguration(configurationSpecification)
  );

  const dungeon = useMemo(() => Dungeon.generate(configuration), [configuration]);

  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    const listener = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        setZoom((zoom) => Math.max(1, zoom - 1));
      } else {
        setZoom((zoom) => zoom + 1);
      }
    };
    document.body.addEventListener("wheel", listener);
    return () => document.body.removeEventListener("wheel", listener);
  });

  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);
  const start = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const handleStart = (location: { clientX: number; clientY: number }) => {
      start.current = { x: location.clientX - dx, y: location.clientY - dy };
    };
    const onMouseDownListener = (e: MouseEvent) => {
      handleStart(e);
      document.body.style.cursor = "move";
    };
    const onTouchStartListener = (e: TouchEvent) => {
      handleStart(e.touches[0]);
    };
    document.body.addEventListener("mousedown", onMouseDownListener);
    document.body.addEventListener("touchstart", onTouchStartListener);
    return () => {
      document.body.removeEventListener("mousedown", onMouseDownListener);
      document.body.removeEventListener("touchstart", onTouchStartListener);
    };
  }, [dx, dy]);

  useEffect(() => {
    const onMouseUpListener = () => {
      start.current = null;
      document.body.style.cursor = "default";
    };
    document.body.addEventListener("mouseup", onMouseUpListener);
    document.body.addEventListener("mouseleave", onMouseUpListener);
    document.body.addEventListener("touchend", onMouseUpListener);
    return () => {
      document.body.removeEventListener("mouseup", onMouseUpListener);
      document.body.removeEventListener("mouseleave", onMouseUpListener);
      document.body.removeEventListener("touchend", onMouseUpListener);
    };
  }, []);

  useEffect(() => {
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
    document.body.addEventListener("mousemove", onMouseMoveListener);
    document.body.addEventListener("touchmove", onTouchMoveListener);
    return () => {
      document.body.removeEventListener("mousemove", onMouseMoveListener);
      document.body.removeEventListener("touchmove", onTouchMoveListener);
    };
  }, []);

  return (
    <>
      <Renderer dungeon={dungeon} zoom={zoom} dx={dx} dy={dy} />
      <Global
        styles={css({
          body: {
            margin: 0,
            background: "#14182e",
          },
          "*, *::after, *::before": {
            boxSizing: "border-box",
          },
          "#root": {
            height: "100vh",
            width: "100vw",
            paddingRight: 0,
            "@media (min-width: 768px)": {
              paddingRight: 300,
            },
          },
        })}
      />
      <ConfigurationEditor<Dungeon.DungeonOptions>
        value={configuration}
        specification={configurationSpecification}
        onChange={setConfiguration}
      />
    </>
  );
};
