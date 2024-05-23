import { createContext, useCallback, useContext, useMemo, useState, type MutableRefObject, type PropsWithChildren } from "react";
import { type A11yDialogInstance } from "react-a11y-dialog";
import AppDialog from "../Modals/AppDialog";


type A11yDialogRef = MutableRefObject<A11yDialogInstance | undefined>;
//? Easier to use the above type to create a mutableRef since createRef() returns a readonly ref object
//? Why not create the ref in the Provider via useRef? Because whenever useDialog() is called, that ref may get reset
const dialogRef: A11yDialogRef = { current: undefined };

type DialogState = PropsWithChildren<{ title: string, hideTitle?: boolean }>;
type DialogProviderContext = { showDialog?: (dialogState: DialogState | false) => void };
const DialogContext = createContext<DialogProviderContext>({ });

export const DialogProvider = ({ children }: PropsWithChildren ) => {
  const [{ title, hideTitle, children: dialogChildren }, setDialogState] = useState<DialogState>({ title: "", hideTitle: false });
  const showDialog = useCallback((newDialogState: DialogState | false) => {
    if (newDialogState) {
      setDialogState(newDialogState);
      dialogRef.current?.show();
    }
    else {
      dialogRef.current?.hide();
      setDialogState({ title: "", children: undefined, hideTitle: false });
    }
  }, []);
  //? useCallback() on functions passed into context values is a simple and good optimization
  //? Memoizing the contextValue to only update when the callback changes also helps!
  const contextValue = useMemo(() => ({ showDialog }), [showDialog]);
  return (
    <DialogContext.Provider value={contextValue}>
      {children}

      <AppDialog title={title} hideTitle={hideTitle} dialogRef={dialogRef}>
        {dialogChildren}
      </AppDialog>
    </DialogContext.Provider>
  );
};

const useDialog = () => {
  const dialog = useContext(DialogContext);
  return dialog;
};

export default useDialog;