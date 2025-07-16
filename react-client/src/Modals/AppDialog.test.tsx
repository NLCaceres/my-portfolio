import { render, screen } from "@testing-library/react";
import AppDialog from "./AppDialog";
import { type RefObject } from "react";
import { A11yDialogInstance } from "react-a11y-dialog";

describe("renders an accessible dialog view over the window", () => {
  test("expecting a title for easier accessibility regardless if the title is visible", () => {
    const mockRef: RefObject<A11yDialogInstance | null> = { current: null };
    const { rerender } = render(<AppDialog dialogRef={mockRef} title="foo-title">Bar</AppDialog>);
    //* WHEN the dialog is hidden
    const hiddenDialog = screen.getByRole("dialog", { hidden: true });
    expect(hiddenDialog).toBeInTheDocument();
    expect(hiddenDialog).toHaveAttribute("aria-hidden", "true");
    //* THEN the title is not visible
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();

    mockRef.current!.show();
    //* WHEN the dialog is made visible
    const visibleDialog = screen.getByRole("dialog", { hidden: false, name: "foo-title" });
    expect(visibleDialog).toBeInTheDocument();
    expect(visibleDialog).not.toHaveAttribute("aria-hidden");
    //* THEN the title is visible to the screen reader by its accessible heading role AND name
    expect(screen.getByRole("heading", { level: 1, name: "foo-title" })).toBeInTheDocument();
    expect(screen.getByText("foo-title")).toBeInTheDocument();
    //* AND the <h1> title + its parent header <div> have their usual CSS + styling
    expect(screen.getByText("foo-title")).toHaveClass("title", { exact: true });
    expect(screen.getByText("foo-title").parentElement).toHaveClass("header", { exact: true });
    mockRef.current!.hide();

    rerender(<AppDialog dialogRef={mockRef} title="hidden-title" hideTitle>Bar</AppDialog>);
    //* WHEN the dialog AND the title is hidden
    const newHiddenDialog = screen.getByRole("dialog", { hidden: true });
    expect(newHiddenDialog).toBeInTheDocument();
    expect(newHiddenDialog).toHaveAttribute("aria-hidden", "true");
    //* THEN the title is not visible
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();

    mockRef.current!.show();
    //* WHEN the dialog is made visible BUT title is still hidden
    const newVisibleDialog = screen.getByRole("dialog", { hidden: false });
    expect(newVisibleDialog).toBeInTheDocument();
    expect(newVisibleDialog).not.toHaveAttribute("aria-hidden");
    //* THEN the title IS VISIBLE to the screen-reader
    const titleElement = screen.getByRole("heading", { level: 1, name: "hidden-title" });
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass("sr-only", { exact: true });
    //* BUT its parent header <div> is still visually hidden
    expect(titleElement.parentElement).toHaveClass("header hidden", { exact: true });
    mockRef.current!.hide(); //* Ensure hidden for next rerender

    //! `hideTitle` == `false` is the same as when `undefined` like in the 1st test render
    rerender(<AppDialog dialogRef={mockRef} title="visible-title" hideTitle={false} />);
    //* WHEN the dialog's title is explicitly made visible
    const anotherDialog = screen.getByRole("dialog", { hidden: true });
    expect(anotherDialog).toBeInTheDocument();
    expect(anotherDialog).toHaveAttribute("aria-hidden", "true");
    //* THEN the title is still hidden when the dialog is hidden
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();

    mockRef.current!.show();
    //* WHEN the dialog is made visible
    const definitelyVisibleDialog = screen.getByRole("dialog", { hidden: false });
    expect(definitelyVisibleDialog).toBeInTheDocument();
    expect(definitelyVisibleDialog).not.toHaveAttribute("aria-hidden");
    //* THEN the title becomes visible and exactly as it was injected in prop
    expect(screen.getByRole("heading", { level: 1, name: "visible-title" })).toBeInTheDocument();
    expect(screen.getByText("visible-title")).toBeInTheDocument();
  });
  test("uses `A11y-Dialog` + useId hook to init the dialog functionality & accessibility", () => {
    const mockRef: RefObject<A11yDialogInstance | null> = { current: null };
    render(<AppDialog dialogRef={mockRef} title="foobar-title">Foobar</AppDialog>);
    mockRef.current!.show();
    //* WHEN rendered
    const dialog = screen.getByRole("dialog");
    //* THEN its ID uses a "-dialog" suffix
    expect(dialog).toHaveAttribute("id", expect.stringContaining("-dialog"));
    //* AND `aria-modal` is set to `true`
    expect(dialog).toHaveAttribute("aria-modal", "true");
    //* AND gets `container` CSS module class
    expect(dialog).toHaveClass("container");
    //* AND the title gets a related ID with additional "-dialog-title" suffix
    expect(screen.getByText("foobar-title"))
      .toHaveAttribute("id", expect.stringContaining("-dialog-title"));
  });
});
