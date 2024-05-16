/* eslint-disable @typescript-eslint/no-explicit-any */
//? Type inference doesn't work when `unknown` or `never` is used as a generic func param, so must use `any`

//* Debounce groups function calls within a specific time period (the `wait` param)
//* so that a function isn't needlessly called repeatedly in quick succession
//* BUT it's worth noting that UNTIL the `wait` period has elapsed, the debounced func will return undefined!
//* Ex: const someFunc = (num: number) => num * 2;
//* Ex: const debouncedFunc = debounce(someFunc, 500);
//* Ex: debouncedFunc(1) ---> returns undefined;
//* Ex: debouncedFunc(2) --> STILL undefined;
//* Ex: debouncedFunc(3) after 500ms passes, FINALLY it returns 4, NOT 2 or 6
//* Ex: It returns a cached return value that used the 2nd most recent arg to calculate
//* Ex: After another 500ms has passed, debouncedFunc(4) would return 6
//* FOR THAT REASON: debounce is awesome for void funcs with side-effects that set some external state (see ViewWidthProvider)
//* BUT not the most useful for funcs with return values because we get that return value in a later call AND with a delay
export function debounce<F extends (...args: any[]) => any>(func: F, wait: number) {
  let timer: NodeJS.Timeout | undefined = undefined;
  let recentArgValues: Parameters<F> | undefined = undefined;
  let returnValue: ReturnType<F> | undefined = undefined;

  const completeDebounce = () => {
    clearTimeout(timer);
    timer = undefined;

    //* If args available, calculate the returnValue with those particular arg values
    if (recentArgValues !== undefined) {
      returnValue = func(...recentArgValues); //* BUT only calculate ONCE
      recentArgValues = undefined; //* THEN toss this particular set of args out
    }
  };

  const debouncedFunc = (...args: Parameters<F>) => {
    recentArgValues = args; //* Grab the debounced function's new arg values

    if (timer) { //* Must be debouncing the function already
      clearTimeout(timer);
    }
    //* Clear the timeout above, so we can reset the debounce wait again below
    timer = setTimeout(completeDebounce, wait);

    return returnValue;
  };

  debouncedFunc.flush = () => {
    //* If the debounced func already completed, THEN no timer will be available
    if (timer === undefined) { return returnValue; } //* SO just return the returnValue

    completeDebounce();
    return returnValue;
  };
  //* Helpers, just in case!
  debouncedFunc.isPending = () => timer !== undefined;
  debouncedFunc.cancel = () => { //* Prevents the debounced func from calculating its returnValue
    clearTimeout(timer);
    timer = undefined;
    recentArgValues = undefined;
  };

  return debouncedFunc;
}
