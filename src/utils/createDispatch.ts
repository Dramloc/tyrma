export type Dispatch = (action: { type: string; payload?: any }, transfer?: Transferable[]) => void;

export const createDispatch = (worker: Worker): Dispatch => {
  const dispatch = (action: { type: string; payload?: any }, transfer: Transferable[] = []) => {
    worker.postMessage(action, transfer);
  };
  return dispatch;
};
