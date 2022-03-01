import { useEffect } from "react";
import ConsoleLogger from "../Functions/LoggerFuncs";

/* //* Idea: Provide simple onMount + onUnmount hooks for functional components
@params: onMount - Func to call. Optional onUnmount - Func to call. 
@params: Boolean  flag to call onMount as the unmount func  */

export default function UseOnMount(onMount, onUnmount = null, reuseOnMount = false) {
  useEffect(() => {
    if (onMount && typeof onMount === 'function') onMount(); //? Customizes
    //? Funcs returned in useEffect are cleanup funcs
    return () => { 
      (onUnmount && typeof onUnmount === 'function') ? onUnmount() : 
      (reuseOnMount && onMount && typeof onMount === 'function') ? onMount() : ConsoleLogger('No Cleanup'); 
    }
  }, [onMount, onUnmount, reuseOnMount]); //? An arr specifying re-render if the contents change
}