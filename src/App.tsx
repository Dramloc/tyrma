import { css, Global } from "@emotion/core";
import { ThemeProvider } from "emotion-theming";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { ConfigurationEditor, getDefaultConfiguration, Specification } from "./generation/ConfigurationEditor";
import * as Dungeon from "./generation/dungeon";
import { Renderer2D, RendererWebGL } from "./rendering/Renderer";
import { Button } from "./ui/Button";
import { CSSReset } from "./ui/CSSReset";
import styled from "./ui/styled";
import { theme } from "./ui/theme";
import { useViewport } from "./utils/useViewport";

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

const RenderersContainer = styled.div({
  position: "absolute",
  width: "100%",
  height: "100%",
});

const RendererContainer = styled.div<{ isVisible: boolean }>(({ theme, isVisible }) => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  opacity: isVisible ? 1 : 0,
  transitionProperty: theme.transitionProperty.opacity,
  transitionDuration: theme.transitionDuration[300],
  transitionTimingFunction: theme.transitionTimingFunction["in-out"],
}));

export const App = () => {
  const [configuration, setConfiguration] = useState<Dungeon.DungeonOptions>(() =>
    getDefaultConfiguration(configurationSpecification)
  );

  const dungeon = useMemo(() => Dungeon.generate(configuration), [configuration]);

  const [render2D, setRender2D] = useState(false);
  const toggleRendering = useCallback(() => setRender2D((render2D) => !render2D), []);

  // Listen for panning and zoom on the canvas
  const rendererRef = useRef<HTMLDivElement | null>(null);
  const { zoom, dx, dy } = useViewport(rendererRef);

  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Global
        styles={css({
          body: {
            background: "#14182e",
          },
          "#root": {
            height: "100vh",
            width: "100vw",
            paddingRight: 0,
            [`@media (min-width: ${theme.breakpoints.sm})`]: {
              paddingRight: 300,
            },
          },
        })}
      />
      <RenderersContainer ref={rendererRef}>
        <RendererContainer isVisible={render2D}>
          <Renderer2D dungeon={dungeon} dx={dx} dy={dy} zoom={zoom} />
        </RendererContainer>
        <RendererContainer isVisible={!render2D}>
          <RendererWebGL dungeon={dungeon} dx={dx} dy={dy} zoom={zoom} />
        </RendererContainer>
      </RenderersContainer>
      <Button style={{ position: "fixed", left: "1rem", bottom: "1rem" }} onClick={toggleRendering}>
        {render2D ? "Show WebGL" : "Show 2D"}
      </Button>
      <ConfigurationEditor<Dungeon.DungeonOptions>
        value={configuration}
        specification={configurationSpecification}
        onChange={setConfiguration}
      />
    </ThemeProvider>
  );
};
