import React from 'react';
import { render } from '@testing-library/react';
import TurnstileWidget from './TurnstileWidget';

describe("renders a Turnstile Verification Widget", () => {
  test("calls Turnstile renderer via timeout that clears on unmount", () => {
    jest.useFakeTimers(); //* Setup timeout + turnstile render mocks
    jest.spyOn(global, 'clearTimeout');
    const turnstileRenderMock = jest.fn();
    window.turnstile = {};
    window.turnstile.render = turnstileRenderMock;

    const { unmount } = render(<TurnstileWidget />);
    jest.runOnlyPendingTimers(); //* Ensure timeout funcs called
    expect(turnstileRenderMock).toHaveBeenCalledTimes(1);

    unmount(); //* clearTimeout called thanks to useCallback cleanup func
    expect(clearTimeout).toHaveBeenCalledTimes(1);

    jest.useRealTimers(); //* Clear mocks out
    jest.restoreAllMocks()
    //* Not sure it's possible to test the related successCallback via mocking unfortunately
    //* On one hand, the mock via 'window.turnstile.render = jest.fn()' works just fine BUT
    //* Setting up a mock that just calls our successCallback doesn't really test the actual setup
  })
  test("uses Turnstile specific id + css modules with a prop to add more classes", () => {
    const { rerender } = render(<TurnstileWidget />);
    const widget = document.body.firstChild.firstChild;
    expect(widget).toHaveAttribute('id', 'turnstile-widget-container');
    expect(widget).toHaveClass(' turnstileContainer', { exact: true });
    
    rerender(<TurnstileWidget className={"foobar"} />);
    expect(widget).toHaveClass('foobar turnstileContainer', { exact: true });
  })
})