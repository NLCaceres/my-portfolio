import { screen, render, renderHook, waitFor, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import useViewWidth, { ViewWidthProvider } from "./ViewWidthProvider";

describe("View Width Provider with a useViewWidth hook for simple consumption", () => {
  const Stub = () => {
    const viewWidth = useViewWidth();
    return ((viewWidth >= 1024) ? <h1>{viewWidth}</h1> : <h1>Smaller than 1024</h1>);
  };
  test("checking the default value, then on resize, consuming useViewWidth's new value", async () => {
    global.window.innerWidth = 1024;
    render(<ViewWidthProvider> <Stub /> </ViewWidthProvider>);
    expect(screen.getByRole("heading")).toHaveTextContent("1024");

    global.window.innerWidth = 1023; //? 1st: Set new width THEN fire resize event to force a rerender with new view
    fireEvent.resize(window); //* Rerender occurs naturally so no need to extract "rerender()", just "await" the change
    await waitFor(() => expect(screen.getByRole("heading")).toHaveTextContent("Smaller than 1024"));

    global.window.innerWidth = 1024;
  });
  test("calling removeEventListener if the ViewWidthProvider unmounts", () => {
    const removeEventSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<ViewWidthProvider> <Stub /> </ViewWidthProvider>);

    expect(removeEventSpy).toHaveBeenCalledTimes(0);
    unmount();
    expect(removeEventSpy).toHaveBeenCalledTimes(1);
  });
  test("providing a default value of 992 via useViewWidth", () => {
    const { result } = renderHook(() => useViewWidth());
    expect(result.current).toBe(992);
  });
});