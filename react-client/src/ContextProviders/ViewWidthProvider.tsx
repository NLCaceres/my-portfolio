import { createContext, useState, useEffect, useContext, ReactNode } from "react"; //todo Remove "React" default import from other files
import debounce from "lodash/debounce";

//* Could use Type instead BUT using interface allows exporting & mixing in via 'implements'
interface SlotProp { //? WHICH is especially helpful given how common 'children slot' props can be
  children: ReactNode
}

const ViewWidthContext = createContext(992); //* Default value
export const ViewWidthProvider = ({ children }: SlotProp ) => {
  const [width, setWidth] = useState(window.innerWidth); //* Pass this window.innerWidth value in as real default!

  useEffect(() => { //? Use debounce to group all resize events into a single setWidth call
    const updateWidth = debounce(() => setWidth(window.innerWidth), 500); //? after 500ms passes w/out a new resize event
    window.addEventListener("resize", updateWidth) //? Throttle would let the width be updated every 500ms
    return () => { window.removeEventListener("resize", updateWidth) };
  }, []);

  return (
    <ViewWidthContext.Provider value={ width }>
      { children }
    </ViewWidthContext.Provider>
  );
}

//* Slightly simpler and more intuitive to use vs the typical 'useContext(someCreatedContext)' to get the value
const useViewWidth = () => {
  const width = useContext(ViewWidthContext);
  return width;
}

export default useViewWidth;