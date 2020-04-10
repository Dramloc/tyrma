import React, { useMemo, useState } from "react";
import { ConfigurationEditor, Specification, getDefaultConfiguration } from "./ConfigurationEditor";
import * as Dungeon from "./dungeon";
import * as Renderer from "./renderer";

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
    },
  },
};

export const App = () => {
  const [configuration, setConfiguration] = useState<Dungeon.DungeonOptions>(() =>
    getDefaultConfiguration(configurationSpecification)
  );
  const dungeon = useMemo(
    () =>
      configuration !== null ? Renderer.render({ wall: "🧱", space: "⬜" }, Dungeon.generate(configuration)) : null,
    [configuration]
  );
  return (
    <>
      <pre>
        <code>{dungeon}</code>
      </pre>
      <ConfigurationEditor<Dungeon.DungeonOptions>
        value={configuration}
        specification={configurationSpecification}
        onChange={setConfiguration}
      />
    </>
  );
};
