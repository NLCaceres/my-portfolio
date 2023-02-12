
export default function SilenceWarning() {
  const origErrorConsole = window.console.error;

  window.console.error = (...args) => {
    const firstArg = args.length > 0 && args[0];

    //* Set up watcher for unimplemented form error
    const shouldBeIgnored = firstArg && typeof firstArg === 'string' &&
      firstArg.includes('Not implemented: HTMLFormElement.prototype.submit');

    if (!shouldBeIgnored) { //* If not a false positive error like above, handle err console logging as normal
      origErrorConsole(...args);
    }
  }
  //* Need to use the return in a test 'window.console.error = origErrorConsole'
  return origErrorConsole;
}