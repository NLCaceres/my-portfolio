import { screen, render, renderHook, waitFor, fireEvent } from "@testing-library/react";
import useViewWidth, { ViewWidthProvider } from "./ViewWidthProvider"

describe("View Width Provider with a useViewWidth hook for simple consumption", () => {
  const Stub = () => {
    const viewWidth = useViewWidth();
    return ((viewWidth >= 1024) ? <h1>{viewWidth}</h1> : <h1>Smaller than 1024</h1>);
  }
  
  test("first injects Jest's default of '1024', and then, on resize, injects new values to useViewWidth consumers", async () => {
    render(<ViewWidthProvider> <Stub /> </ViewWidthProvider>)
    expect(screen.getByRole("heading")).toHaveTextContent("1024");

    //? Resize events are extremely flakey due to Jest's underlying usage of jsDOM 
    //? so defineProperty() + fireEvent.resize() is the best way to force a rerender if a resize event changes viewWidth
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 1023 }); //? Might not work more than once though!
    fireEvent.resize(window); //* Rerender occurs naturally so no need to extract "rerender()", just "await" the change
    await waitFor(() => expect(screen.getByRole("heading")).toHaveTextContent("Smaller than 1024"));
  })
  test("calling removeEventListener if the ViewWidthProvider unmounts", () => {
    const removeEventSpy = jest.spyOn(window, "removeEventListener");
    const { unmount } = render(<ViewWidthProvider> <Stub /> </ViewWidthProvider>)

    expect(removeEventSpy).toHaveBeenCalledTimes(0);
    unmount();
    expect(removeEventSpy).toHaveBeenCalledTimes(1);
  })
  test("providing a default value of 992 via useViewWidth", () => {
    const { result } = renderHook(() => useViewWidth());
    expect(result.current).toBe(992);
  })
})