import { css, Global } from "@emotion/core";
import { ThemeProvider } from "emotion-theming";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConfigurationEditor, getDefaultConfiguration, Specification } from "./generation/ConfigurationEditor";
import * as Dungeon from "./generation/dungeon";
import { createRendererWorker, Renderer } from "./rendering/Renderer";
import { CSSReset } from "./ui/CSSReset";
import styled from "./ui/styled";
import { theme } from "./ui/theme";
import { createDispatch } from "./utils/createDispatch";
import { useViewportListener } from "./utils/useViewportListener";

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

const RendererContainer = styled.div({
  width: "100%",
  height: "100%",
});

const rendererWorker = createRendererWorker();
const rendererDispatch = createDispatch(rendererWorker);

export const App = () => {
  const [configuration, setConfiguration] = useState<Dungeon.DungeonOptions>(() =>
    getDefaultConfiguration(configurationSpecification)
  );

  const dungeon = useMemo(() => Dungeon.generate(configuration), [configuration]);
  useEffect(() => rendererDispatch({ type: "SET_DUNGEON", payload: dungeon }), [dungeon]);

  // Listen for panning and zoom on the canvas
  const rendererRef = useRef<HTMLDivElement | null>(null);
  const onViewportChange = useCallback((dx, dy, zoom) => {
    rendererDispatch({
      type: "SET_VIEWPORT",
      payload: {
        dx: dx * window.devicePixelRatio,
        dy: dy * window.devicePixelRatio,
        zoom: zoom * window.devicePixelRatio,
      },
    });
  }, []);
  useViewportListener(rendererRef, onViewportChange);

  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Global
        styles={css({
          body: {
            background: "#14182e",
          },
          "#root": {
            position: "relative",
            height: "100vh",
            width: "100vw",
            paddingRight: 0,
            [`@media (min-width: ${theme.breakpoints.sm})`]: {
              paddingRight: 300,
            },
          },
        })}
      />
      <RendererContainer ref={rendererRef}>
        <Renderer dispatch={rendererDispatch} />
      </RendererContainer>
      <ConfigurationEditor<Dungeon.DungeonOptions>
        value={configuration}
        specification={configurationSpecification}
        onChange={setConfiguration}
      />
    </ThemeProvider>
  );
};
