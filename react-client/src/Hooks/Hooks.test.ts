import { renderHook, waitFor } from "@testing-library/react";
import { type Mock, vi } from "vitest";
import UseNullableAsync from "./UseAsync";

describe("enables async fetch requests and their callbacks to be cancelled if component rerenders", () => {
  let asyncFuncMock: Mock; let callbackMock: Mock;
  beforeEach(() => {
    asyncFuncMock = vi.fn();
    callbackMock = vi.fn();
  });
  describe("calling a success callback", () => {
    test("with any resulting data", async () => {
      asyncFuncMock.mockReturnValue("123");
      renderHook(() => UseNullableAsync(asyncFuncMock, callbackMock));
      expect(asyncFuncMock).toHaveBeenCalledTimes(1);
      await waitFor(() => { expect(callbackMock).toHaveBeenCalledTimes(1); });
      expect(callbackMock).toHaveBeenLastCalledWith("123");
    });
    test("alone if no data returned", async () => {
      renderHook(() => UseNullableAsync(asyncFuncMock, callbackMock));
      expect(asyncFuncMock).toHaveBeenCalledTimes(1);
      await waitFor(() => { expect(callbackMock).toHaveBeenCalledTimes(1); });
      expect(callbackMock).toHaveBeenLastCalledWith(); //* Function receives no parameters!
    });
    test("if the hook's parent component is alive", () => {
      asyncFuncMock.mockImplementation(() => new Promise((r) => setTimeout(r, 4000))); //* Delay promise resolution by 4s
      const { unmount } = renderHook(() => UseNullableAsync(asyncFuncMock, callbackMock));
      unmount(); //* Unmount prevents asyncFunc from resolving to let callback fire
      expect(asyncFuncMock).toHaveBeenCalledTimes(1); //* Async function likely fired but left waiting
      expect(callbackMock).not.toHaveBeenCalled(); //* Unmount should set alive to false, preventing the callback from firing
    });
    test("if it is passed in", () => {
      renderHook(() => UseNullableAsync(asyncFuncMock));
      expect(asyncFuncMock).toHaveBeenCalledTimes(1); //* Async function fired but no callback to run afterward
      expect(callbackMock).not.toHaveBeenCalled(); //* So call nothing else, hook complete! unless rerender changes asyncFunc
    });
  });
  test("calling only ONCE unless the fetch function or its callback changes", async () => {
    //? RenderHook is actually a convenience wrapper for the typical Testing-Lib render func, so you can more easily test hooks
    //? 1st Param accepts `(props?) => yourHook`, so it can optionally accept props to pass to your Hook
    //? The 2nd param accepts options with the initialProps option being particularly useful
    //? Since it allows you to pass initial values to your Hook to use on start
    const { rerender } = renderHook(
      ({ asyncFunc, onSuccess }: { asyncFunc: Mock, onSuccess: Mock }) => UseNullableAsync(asyncFunc, onSuccess),
      { initialProps: { asyncFunc: asyncFuncMock, onSuccess: callbackMock }}
    );
    expect(asyncFuncMock).toHaveBeenCalledTimes(1);
    await waitFor(() => { expect(callbackMock).toHaveBeenCalledTimes(1); });

    const changedAsync = vi.fn();
    //? Use rerender to pass new values to the render func declared on line 45 so it can re-create my Hook with params
    rerender({ asyncFunc: changedAsync, onSuccess: callbackMock });
    expect(asyncFuncMock).toHaveBeenCalledTimes(1); //* Will not be called again since it was replaced
    expect(changedAsync).toHaveBeenCalledTimes(1); //* Will be called instead of the above asyncFuncMock
    await waitFor(() => { expect(callbackMock).toHaveBeenCalledTimes(2); }); //* Will have been called again on 2nd success

    const changedCallback = vi.fn();
    rerender({ asyncFunc: changedAsync, onSuccess: changedCallback });
    expect(changedAsync).toHaveBeenCalledTimes(2); //* Will be called for second time due to rerender
    await waitFor(() => { expect(callbackMock).toHaveBeenCalledTimes(2); }); //* Will no longer be called so it remains at 2
    await waitFor(() => { expect(changedCallback).toHaveBeenCalledTimes(1); }); //* Now firing this callback on success
  });
});