import { useEffect } from "react";

/* //* Idea: Provide cancellable async functions that won't fire off state updates if component isn't mounted/rendered/alive
@params: asyncFunc - Use to fetch some server data -- Tip: Usually best to pass in a useCallback-backed func to prevent endless rerenders
@params: onSuccess - Callback to use data from the Promise -- Tip: Convenient to pass in the setFunc from useState
* IsAlive - Check if component using this Hook has been unmounted/rerendered. If not alive, DON'T allow state update */
export default function UseNullableAsync<T>(asyncFunc: () => Promise<T>, onSuccess?: (result?: T) => void): void {
  useEffect(() => {
    let isAlive = true;
    (async () => { //? Good trick to avoid old school promises.then(callback)
      const data = await asyncFunc();
      if (onSuccess && isAlive) { //* If there's a callback to use, check if alive then run it
        (data) ? onSuccess(data) : onSuccess(); //* If it needs data, pass it, or just run it without a param
      }
    })(); //* Call this anonymous function/block of async code
    return () => { isAlive = false; }; //? When calling/parent component unmounts, effect WILL immediately cleanup, preventing onSuccess callback
  }, [asyncFunc, onSuccess]);
}