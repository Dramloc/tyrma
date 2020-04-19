import { createDispatch, Dispatch } from "../utils/createDispatch";
import * as Dungeon from "./dungeon";

let rendererDispatch: Dispatch = () => {};

globalThis.addEventListener("message", (e) => {
  const action = e.data;
  switch (action.type) {
    case "SET_PORT": {
      rendererDispatch = createDispatch(action.payload as MessagePort);
      break;
    }
    case "SET_CONFIGURATION": {
      const dungeon = Dungeon.generate(action.payload);
      rendererDispatch({ type: "SET_DUNGEON", payload: dungeon });
      break;
    }
  }
});
