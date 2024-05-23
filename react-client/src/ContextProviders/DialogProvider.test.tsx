import { screen, render, renderHook } from "@testing-library/react";
import useDialog, { DialogProvider } from "./DialogProvider";
import userEvent from "@testing-library/user-event";
import { type PropsWithChildren } from "react";

describe("renders a Dialog component that can be accessed via a provided function", () => {
  test("by default, the provided function is undefined", () => {
    const { result } = renderHook(() => useDialog());
    expect(result.current.showDialog).toBeUndefined();
  });
  test("if provider's child component calls the provided `showDialog` function with a new state object for the dialog to render", async () => {
    const user = userEvent.setup();
    let dialogState: PropsWithChildren<{ title: string, hideTitle?: boolean }> | false = { title: "Hello!", children: <div>Barfoo</div> };
    const Stub = () => {
      const { showDialog } = useDialog();
      return <button onClick={() => { showDialog && showDialog(dialogState); } }>Foobar</button>;
    };
    render(<DialogProvider><Stub /></DialogProvider>);

    //* Dialog is present in the layout BUT the title is hidden
    expect(screen.getByRole("dialog", { hidden: true })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 1 , name: "Hello!" })).not.toBeInTheDocument();
    //* WHEN the provider's child component calls the showDialog function provided by the context
    await user.click(screen.getByText("Foobar"));
    //* THEN the dialog becomes visible along with the children passed in by the showDialog func
    expect(screen.getByRole("dialog", { hidden: false })).toBeVisible();
    expect(screen.getByRole("heading", { level: 1, name: "Hello!" })).toBeInTheDocument();
    expect(screen.getByText("Barfoo")).toBeInTheDocument();
    await user.click(screen.getByLabelText("Close this dialog window")); //* Close the dialog
    expect(screen.getByRole("dialog", { hidden: true })); //* Dialog hidden again

    //* WHEN showDialog changes the child it passes to the AppDialog
    dialogState = { title: "World", children: <div>Fizz</div> };
    await user.click(screen.getByText("Foobar"));
    //* THEN this new child is rendered in the dialog instead
    expect(screen.getByRole("heading", { level: 1, name: "World" })).toBeInTheDocument();
    expect(screen.getByText("Fizz")).toBeInTheDocument();
    await user.click(screen.getByLabelText("Close this dialog window"));
    expect(screen.getByRole("dialog", { hidden: true }));

    //* ShowDialog can also accept the AppDialog's `hideTitle` to visually hide its title
    dialogState = { title: "Hidden title", hideTitle: true, children: <div>Buzz</div> };
    expect(screen.queryByRole("heading", { level: 1, name: "Hidden title" })).not.toBeInTheDocument();
    await user.click(screen.getByText("Foobar"));
    //* BUT the title is still visible to screen-readers upon dialog opening
    expect(screen.getByRole("heading", { level: 1, name: "Hidden title" })).toHaveClass("sr-only");
    expect(screen.getByText("Buzz")).toBeInTheDocument();

    //* WHEN clicking away from the dialog
    await user.click(screen.getByText("Foobar"));
    //* THEN NORMALLY you'd expect the dialog to become hidden again BUT NOT IN TESTS
    expect(screen.getByRole("dialog", { hidden: false }));
    expect(screen.getByRole("heading", { level: 1, name: "Hidden title" })).toHaveClass("sr-only");
    expect(screen.getByText("Buzz")).toBeInTheDocument();

    //* WHEN the child component sends `false` back to the DialogProvider's dialogState
    dialogState = false;
    await user.click(screen.getByText("Foobar"));
    //* THEN the dialog is hidden again
    expect(screen.getByRole("dialog", { hidden: true })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 1, name: "Hidden title" })).not.toBeInTheDocument();
  });
});