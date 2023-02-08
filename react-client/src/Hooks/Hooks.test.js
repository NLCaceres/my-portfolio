import { renderHook, waitFor } from "@testing-library/react";
import UseNullableAsync from "./UseAsync";


describe("enables async fetch requests and their callbacks to be cancelled if component rerenders", () => {
  let asyncFuncMock; let callbackMock;
  beforeEach(() => {
    asyncFuncMock = jest.fn();
    callbackMock = jest.fn();
  })
  describe("calling a success callback", () => {
    test("with any resulting data", async () => {
      asyncFuncMock.mockReturnValue("123");
      renderHook(() => UseNullableAsync(asyncFuncMock, callbackMock));
      expect(asyncFuncMock).toHaveBeenCalledTimes(1);
      await waitFor(() => { expect(callbackMock).toHaveBeenCalledTimes(1) });
      expect(callbackMock).toHaveBeenLastCalledWith("123");
    })
    test("alone if no data returned", async () => {
      renderHook(() => UseNullableAsync(asyncFuncMock, callbackMock));
      expect(asyncFuncMock).toHaveBeenCalledTimes(1);
      await waitFor(() => { expect(callbackMock).toHaveBeenCalledTimes(1) });
      expect(callbackMock).toHaveBeenLastCalledWith(); //* Function receives no parameters!
    })
    test("if the hook's parent component is alive", () => {
      asyncFuncMock.mockImplementation(() => new Promise((r) => setTimeout(r, 4000))) //* Delay promise resolution by 4s
      const { unmount } = renderHook(() => UseNullableAsync(asyncFuncMock, callbackMock));
      unmount(); //* Unmount prevents asyncFunc from resolving to let callback fire
      expect(asyncFuncMock).toHaveBeenCalledTimes(1); //* Async function likely fired but left waiting
      expect(callbackMock).not.toHaveBeenCalled(); //* Unmount should set alive to false, preventing the callback from firing
    })
    test("if it is passed in", () => {
      renderHook(() => UseNullableAsync(asyncFuncMock));
      expect(asyncFuncMock).toHaveBeenCalledTimes(1); //* Async function fired but no callback to run afterward
      expect(callbackMock).not.toHaveBeenCalled(); //* So call nothing else, hook complete! unless rerender changes asyncFunc
    })
  })
  test("calling only ONCE unless the fetch function or its callback changes", async () => {
    //? Not sure exactly how the following object creation works in renderHook's 1st render function param - (propsObj) => yourHook
    //? Seems that you can pass an object which you define the properties for, set their values, THEN set it equal to an empty object
    //? Which allows usage of those object props/vals for all future renderings in the hook you originally passed in
    const { rerender } = renderHook(({ asyncFunc = asyncFuncMock, callbackFunc = callbackMock } = {}) => UseNullableAsync(asyncFunc, callbackFunc));
    expect(asyncFuncMock).toHaveBeenCalledTimes(1);
    await waitFor(() => { expect(callbackMock).toHaveBeenCalledTimes(1) });

    const changedAsync = jest.fn();
    //? Here the 1st render func param expects the same props as line 42 so it can access their new values to use in a rerendering of my hook
    rerender({ asyncFunc: changedAsync, callbackFunc: callbackMock });
    expect(asyncFuncMock).toHaveBeenCalledTimes(1); //* Will not be called again since it was replaced
    expect(changedAsync).toHaveBeenCalledTimes(1); //* Will be called instead of the above asyncFuncMock
    await waitFor(() => { expect(callbackMock).toHaveBeenCalledTimes(2) }); //* Will have been called again on 2nd success

    const changedCallback = jest.fn();
    rerender({ asyncFunc: changedAsync, callbackFunc: changedCallback });
    expect(changedAsync).toHaveBeenCalledTimes(2); //* Will be called for second time due to rerender
    await waitFor(() => { expect(callbackMock).toHaveBeenCalledTimes(2) }); //* Will no longer be called so it remains at 2
    await waitFor(() => { expect(changedCallback).toHaveBeenCalledTimes(1) }); //* Now firing this callback on success
  })
})