import { css, Global } from "@emotion/core";
import React, { useEffect, useMemo, useState } from "react";
import { ConfigurationEditor, getDefaultConfiguration, Specification } from "./ConfigurationEditor";
import * as Dungeon from "./dungeon";
import { Renderer2D } from "./Renderer2D";

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

const defaultConfiguration = getDefaultConfiguration(configurationSpecification);

export const App = () => {
  const [configuration, setConfiguration] = useState<Dungeon.DungeonOptions>(defaultConfiguration);

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
  useEffect(() => {
    let start: { x: number; y: number } | null = null;
    const onMouseDownListener = (e: MouseEvent) => {
      start = { x: e.x - dx, y: e.y - dy };
    };
    const onMouseUpListener = () => {
      start = null;
    };
    const onMouseMoveListener = (e: MouseEvent) => {
      if (start === null) {
        return;
      }
      setDx(e.x - start.x);
      setDy(e.y - start.y);
    };
    document.body.addEventListener("mousedown", onMouseDownListener);
    document.body.addEventListener("mouseup", onMouseUpListener);
    document.body.addEventListener("mousemove", onMouseMoveListener);
    return () => {
      document.body.removeEventListener("mousedown", onMouseDownListener);
      document.body.removeEventListener("mouseup", onMouseUpListener);
      document.body.removeEventListener("mousemove", onMouseMoveListener);
    };
  }, [dx, dy]);

  return (
    <>
      <Renderer2D dungeon={dungeon} zoom={zoom} dx={dx} dy={dy} />
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            paddingRight: 300,
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
