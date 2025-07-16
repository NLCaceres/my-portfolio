import { render, screen } from "@testing-library/react";
import AppDialog from "./AppDialog";
import { type RefObject } from "react";
import { A11yDialogInstance } from "react-a11y-dialog";

describe("renders an accessible dialog view over the window", () => {
  test("expecting a title for easier accessibility regardless if the title is visible", () => {
    const mockRef: RefObject<A11yDialogInstance | null> = { current: null };
    const { rerender } = render(<AppDialog dialogRef={mockRef} title="Welcome Dialog">Hello World!</AppDialog>);
    //* WHEN the dialog is hidden
    const hiddenDialog = screen.getByRole("dialog", { hidden: true });
    expect(hiddenDialog).toBeInTheDocument();
    expect(hiddenDialog).toHaveAttribute("aria-hidden", "true");
    //* THEN the title is not visible
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();

    mockRef.current!.show();
    //* WHEN the dialog is made visible
    const visibleDialog = screen.getByRole("dialog", { hidden: false, name: "Welcome Dialog" });
    expect(visibleDialog).toBeInTheDocument();
    expect(visibleDialog).not.toHaveAttribute("aria-hidden");
    //* THEN the title is visible to the screen reader by its heading role
    expect(screen.getByRole("heading", { level: 1, name: "Welcome Dialog" })).toBeInTheDocument();
    expect(screen.getByText("Welcome Dialog")).toBeInTheDocument(); //* A11y name of the <h1> tag matches its text
    //* Both the title and its parent header <div> have their normal CSS classes and styling
    expect(screen.getByText("Welcome Dialog")).toHaveClass("title", { exact: true });
    expect(screen.getByText("Welcome Dialog").parentElement).toHaveClass("header", { exact: true });
    mockRef.current!.hide();

    rerender(<AppDialog dialogRef={mockRef} title="Hidden Dialog" hideTitle>Hello World!</AppDialog>);
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
    //* THEN the title is STILL VISIBLE TO THE SCREEN READER, even if the parent header <div> is visually hidden
    const titleElement = screen.getByRole("heading", { level: 1, name: "Hidden Dialog" });
    expect(titleElement.parentElement).toHaveClass("header hidden", { exact: true });
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass("sr-only", { exact: true }); //* AND even if the title is visually hidden
    mockRef.current!.hide(); //* Ensure hidden for next rerender

    //! hideTitle set to false acts the same as when its undefined on the initial render
    rerender(<AppDialog dialogRef={mockRef} title="Visible Dialog" hideTitle={false} />);
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
    //* THEN the title becomes visible
    expect(screen.getByRole("heading", { level: 1, name: "Visible Dialog" })).toBeInTheDocument();
  });
  test("uses `A11y-Dialog`'s hook and the useId hook to setup the dialog functionality and accessibility", () => {
    const mockRef: RefObject<A11yDialogInstance | null> = { current: null };
    render(<AppDialog dialogRef={mockRef} title="Welcome Dialog">Hello World!</AppDialog>);
    mockRef.current!.show();
    //* WHEN the dialog is rendered, THEN its ID ends with a "-dialog" suffix, has an aria-modal attribute
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("id", expect.stringContaining("-dialog"));
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveClass("container"); //* AND it uses the expected "container" CSS module class

    //* AND the title has a similar ID that adds an additional "-title" suffix to the "-dialog" suffix
    expect(screen.getByText("Welcome Dialog")).toHaveAttribute("id", expect.stringContaining("-dialog-title"));
  });
});
