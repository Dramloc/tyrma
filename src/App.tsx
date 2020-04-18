import { css, Global } from "@emotion/core";
import React, { useMemo, useState } from "react";
import { ConfigurationEditor, getDefaultConfiguration, Specification } from "./ConfigurationEditor";
import * as Dungeon from "./dungeon";
import { Renderer2D, RendererWebGL } from "./Renderer";

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

  return (
    <>
      <Renderer2D dungeon={dungeon} />
      <RendererWebGL dungeon={dungeon} />
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
