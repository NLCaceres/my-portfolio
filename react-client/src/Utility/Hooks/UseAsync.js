import { useEffect } from "react";
import ConsoleLogger from "../Functions/LoggerFuncs";

/* //* Idea: Provide cancellable async functions that won't fire off callbacks when component is dead
@params: asyncFunc - To call, onSuccess - Callback to use thenableData
* IsAlive - Check if component using this Hook has been unmounted */
export default function UseNullableAsync(asyncFunc, onSuccess) {
  useEffect(() => {
    let isAlive = true;
    (async () => { //? Good trick to avoid old school promises.then(callback)
      const data = await asyncFunc();
      if (isAlive) { (data) ? onSuccess(data) : onSuccess(); }
    })() //* Call our anonymous func
    return () => { isAlive = false }; //? When using component unmounts, it should immediately cleanup, stopping onSuccess callback
  }, [asyncFunc, onSuccess]);
}