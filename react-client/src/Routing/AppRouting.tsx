import { useLocation, Outlet, useOutletContext } from "react-router-dom";
import { animated, useTransition } from "@react-spring/web";
import AppRoutingCss from "./AppRouting.module.css";
import { type AlertFunc, type ModalFunc } from "../App/App";

type AppRoutingProps = {
  context: [ModalFunc, AlertFunc]
};

const AppRouting = ({ context }: AppRoutingProps) => {
  //! Animations
  const location = useLocation();
  const transitions = useTransition(location, {
    config: { tension: 200, friction: 15 },
    keys: (item) => item.pathname, //? Prevents multiple Transition rerenders (limiting it nicely to two animating divs)
    from: { transform: "translate3d(200%,0,0)", opacity: 0 }, enter: { transform: "translate3d(0%,0,0)", opacity: 1 },
    leave: { transform: "translate3d(-200%,0,0)", opacity: 0, position: "absolute" }, //? Give space to newly entering Route
  });

  return transitions(style => ( //* No container around the animated.div needed if only the exiting div is position: absolute (AKA out of the HTML doc's flow)
    <animated.div className={AppRoutingCss.animator} style={style}>
      <Outlet context={context} />
    </animated.div>
  ));
};

export function useRoutingContext() {
  return useOutletContext<[ModalFunc, AlertFunc]>();
}

export default AppRouting;