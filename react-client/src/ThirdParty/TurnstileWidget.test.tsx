import { vi } from "vitest";
import { render } from "@testing-library/react";
import TurnstileWidget from "./TurnstileWidget";

describe("renders a Turnstile Verification Widget", () => {
  test("calls Turnstile renderer via timeout that clears on unmount", () => {
    vi.useFakeTimers(); //* Setup timeout + turnstile render mocks
    vi.spyOn(global, "clearTimeout");
    const turnstileRenderMock = vi.fn();
    window.turnstile = { 
      ready: vi.fn(), implicitRender: vi.fn(), execute: vi.fn(), 
      reset: vi.fn(), remove: vi.fn(), getResponse: vi.fn(), 
      render: turnstileRenderMock 
    };

    const { unmount } = render(<TurnstileWidget action="" successCB={vi.fn()} />);
    vi.runOnlyPendingTimers(); //* Ensure timeout funcs called
    expect(turnstileRenderMock).toHaveBeenCalledTimes(1);

    unmount(); //* clearTimeout called thanks to useCallback cleanup func
    expect(clearTimeout).toHaveBeenCalledTimes(1);

    vi.useRealTimers(); //* Clear mocks out
    vi.restoreAllMocks();
    //* Not sure it's possible to test the related successCallback via mocking unfortunately
    //* On one hand, the mock via "window.turnstile.render = vi.fn()" works just fine BUT
    //* Setting up a mock that just calls our successCallback doesn't really test the actual setup
  })
  test("uses Turnstile specific id + css modules with a prop to add more classes", () => {
    const { rerender } = render(<TurnstileWidget action="" successCB={vi.fn()} />);
    const widget = document.body.firstChild!.firstChild;
    expect(widget).toHaveAttribute("id", "turnstile-widget-container");
    expect(widget).toHaveClass(" turnstileContainer", { exact: true });
    
    rerender(<TurnstileWidget className={"foobar"} action="" successCB={vi.fn()} />);
    expect(widget).toHaveClass("foobar turnstileContainer", { exact: true });
  })
})