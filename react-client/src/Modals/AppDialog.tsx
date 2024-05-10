import { type PropsWithChildren, type MutableRefObject, useId } from "react";
import { createPortal } from "react-dom";
import { type A11yDialogInstance, useA11yDialog } from "react-a11y-dialog";
import AppDialogCss from "./AppDialog.module.css";

//* Generally, the following is implemented as `(show: boolean) => { show ? ref.open() : ref.hide(); }`
export type DialogOpener = (show: boolean) => void;

type DialogProps = {
  title: string //? Required to help assistive tech identify the dialog to users
  hideTitle?: boolean,
  dialogRef: MutableRefObject<A11yDialogInstance | undefined>
};

const AppDialog = ({ title, hideTitle = false, dialogRef, children }: PropsWithChildren<DialogProps>) => {
  const dialogID = useId();
  const [instance, attr] = useA11yDialog({ id: dialogID + "-dialog" });
  dialogRef.current = instance ?? undefined;

  const headerCSS = hideTitle ? `${AppDialogCss.header} ${AppDialogCss.hidden}` : AppDialogCss.header;
  const titleCSS = hideTitle ? "sr-only" : AppDialogCss.title;

  return createPortal(
    <div {...attr.container} className={AppDialogCss.container}>
      <div {...attr.overlay} className={AppDialogCss.overlay} />
      <div {...attr.dialog} className={AppDialogCss.dialog}>
        <div className={headerCSS}>
          <h1 id={attr.title.id} className={titleCSS}>{title}</h1>
          <button {...attr.closeButton} className={AppDialogCss.closeButton} aria-label="Close this dialog window" />
        </div>

        <div className={AppDialogCss.content}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AppDialog;