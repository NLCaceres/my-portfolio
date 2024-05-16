import { debounce } from "./Debounce";

describe("Provides a debouncer to group functions called in rapid succession", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => { vi.useRealTimers(); });
  test("waiting a specific time in milliseconds before calling the function", () => {
    const mockFn = vi.fn((str: string) => str);
    const debouncedMock = debounce(mockFn, 500);
    //* First debounce will be a series of undefined returns
    expect(debouncedMock("foo")).toBeUndefined();
    expect(debouncedMock("bar")).toBeUndefined();
    expect(debouncedMock("foobar")).toBeUndefined();
    expect(mockFn).not.toHaveBeenCalled(); //* The underlying func still hasn't been called
    expect(debouncedMock.isPending()).toBe(true); //* Debounce still pending!

    //* WHEN 500ms finally elapses between func calls
    vi.advanceTimersByTime(500);
    //* THEN the func will return the 2nd most recent return,
    expect(mockFn).toHaveBeenCalledOnce(); //* AND only now has the underlying func actually been called
    expect(debouncedMock.isPending()).toBe(false); //* AND debounce no longer pending

    expect(debouncedMock("abc")).not.toBe("abc"); //* NOT the return value expected from the current call
    expect(debouncedMock.isPending()).toBe(true); //* Debounce pending again
    expect(debouncedMock("abc")).toBe("foobar"); //* "Foobar" from before the timer advance
    expect(debouncedMock("foo")).toBe("foobar"); //* Still not "abc" or "foo"
    expect(mockFn).toHaveBeenCalledOnce(); //* After more debounced calls, still only once has the underlying func been called

    //* WHEN 250ms elapses (so less than 500ms) and the func is called again
    vi.advanceTimersByTime(250);
    //* THEN the func still returns that 2nd most recent return
    expect(debouncedMock("def")).toBe("foobar");
    expect(mockFn).toHaveBeenCalledOnce(); //* Still no 2nd call
    expect(debouncedMock.isPending()).toBe(true); //* Still pending

    //* EVEN after 500ms has passed since the last updated return
    vi.advanceTimersByTime(250); //* IF 500 TOTAL ms hasn't elapsed
    expect(debouncedMock("def")).toBe("foobar"); //* The return value remains the same
    expect(mockFn).toHaveBeenCalledOnce(); //* STILL no 2nd call
    expect(debouncedMock.isPending()).toBe(true); //* Still pending

    //* WHEN 500ms finally elapses without a single call
    vi.advanceTimersByTime(500);
    //* THEN the 2nd most recent return will have its value returned
    expect(debouncedMock.isPending()).toBe(false); //* AND debounce complete
    expect(debouncedMock("foo")).toBe("def"); //* NOT this current call's return
    expect(mockFn).toHaveBeenCalledTimes(2); //* FINALLY 2nd call

    const otherMockFn = vi.fn((str: string) => str);
    const zeroDebounceMock = debounce(otherMockFn, 0);
    //* EVEN WHEN the debounce timer is set to 0, THEN the func will start by returning undefined
    expect(zeroDebounceMock("foo")).toBeUndefined();
    expect(zeroDebounceMock("bar")).toBeUndefined();
    expect(zeroDebounceMock("foobar")).toBeUndefined();
    //* AND no call to the underlying func even with a 0ms debounce
    expect(otherMockFn).toHaveBeenCalledTimes(0);
    expect(zeroDebounceMock.isPending()).toBe(true); //* Debounce still pending even with a 0ms debounce
    //* UNTIL a second has passed, THEN it'll return the 2nd most recent value
    vi.advanceTimersByTime(1);
    expect(zeroDebounceMock.isPending()).toBe(false); //* Debounce complete and no longer pending
    expect(zeroDebounceMock("abc")).toBe("foobar");
    expect(otherMockFn).toHaveBeenCalledTimes(1); //* AND the underlying func has been called
    expect(zeroDebounceMock.isPending()).toBe(true); //* AND immediately restarted again thanks to the call at line 62
  });
  test("can cancel the function", () => {
    const mockFn = vi.fn((str: string) => str);
    const debouncedMock = debounce(mockFn, 500);
    expect(debouncedMock("foo")).toBeUndefined();

    debouncedMock.cancel(); //* WHEN the func's debounce is cancelled
    vi.advanceTimersByTime(500);
    //* THEN no return value will available when the time elapses
    expect(debouncedMock("foo")).not.toBe("foo");
    expect(debouncedMock("foo")).toBeUndefined();

    //* With more calls to the debouncedMock, the debounce CAN complete and return a value after the delay period
    vi.advanceTimersByTime(500);
    expect(debouncedMock("foo")).toBe("foo");
    //* EVEN if the debounce is cancelled again, the return value will remain defined
    debouncedMock.cancel();
    expect(debouncedMock("abc")).toBe("foo");
    //* AND the debounce will continue to work as expected
    vi.advanceTimersByTime(500);
    expect(debouncedMock("def")).toBe("abc");
  });
  test("can flush out the value if we no longer want to wait", () => {
    const mockFn = vi.fn((str: string) => str);
    const debouncedMock = debounce(mockFn, 500);
    //* WHEN the debounce is flushed BUT was never called,
    expect(debouncedMock.flush()).toBeUndefined(); //* THEN it returns undefined since no return value exists

    expect(debouncedMock("foo")).toBeUndefined();
    //* WHEN the debounce is flushed after a call, THEN it returns the most recent call's return value
    expect(debouncedMock.flush()).toBe("foo");

    expect(debouncedMock.flush()).toBe("foo"); //* A 2nd call to flush will still return that same value

    //* Any future calls to the debounced func immediately return that flushed return value
    expect(debouncedMock("abc")).toBe("foo");

    vi.advanceTimersByTime(500);
    //* WHEN the timer finally does elapse, the debounce works as expected returning the 2nd most recent return
    expect(debouncedMock("foo")).toBe("abc"); //* "abc", NOT the current call with "foo"
  });
});