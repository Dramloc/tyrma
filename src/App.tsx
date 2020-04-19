import { css, Global } from "@emotion/core";
import { ThemeProvider } from "emotion-theming";
import React, { useEffect, useState } from "react";
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import GeneratorWorker from "worker-loader!./generation/GeneratorWorker";
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import RendererWebGLWorker from "worker-loader!./rendering/RendererWebGLWorker";
import { ConfigurationEditor, getDefaultConfiguration, Specification } from "./generation/ConfigurationEditor";
import * as Dungeon from "./generation/dungeon";
import { Renderer } from "./rendering/Renderer";
import { CSSReset } from "./ui/CSSReset";
import { theme } from "./ui/theme";
import { createDispatch } from "./utils/createDispatch";

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

const generatorWorker = GeneratorWorker();
const generatorDispatch = createDispatch(generatorWorker);
const rendererWorker = RendererWebGLWorker();
const rendererDispatch = createDispatch(rendererWorker);
const channel = new MessageChannel();
rendererDispatch({ type: "SET_PORT", payload: channel.port1 }, [channel.port1]);
generatorDispatch({ type: "SET_PORT", payload: channel.port2 }, [channel.port2]);

export const App = () => {
  const [configuration, setConfiguration] = useState<Dungeon.DungeonOptions>(() =>
    getDefaultConfiguration(configurationSpecification)
  );

  useEffect(() => generatorDispatch({ type: "SET_CONFIGURATION", payload: configuration }), [configuration]);

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
      <Renderer dispatch={rendererDispatch} />
      <ConfigurationEditor<Dungeon.DungeonOptions>
        value={configuration}
        specification={configurationSpecification}
        onChange={setConfiguration}
      />
    </ThemeProvider>
  );
};
