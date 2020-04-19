export type Dispatch = (action: { type: string; payload?: any }, transfer?: Transferable[]) => void;

export const createDispatch = (target: Worker | MessagePort): Dispatch => {
  const dispatch = (action: { type: string; payload?: any }, transfer: Transferable[] = []) => {
    target.postMessage(action, transfer);
  };
  return dispatch;
};
