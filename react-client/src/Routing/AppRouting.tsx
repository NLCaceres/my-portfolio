import { useLocation, Outlet, useOutletContext } from "react-router-dom";
import { animated, useTransition } from "@react-spring/web";
import AppRoutingCss from "./AppRouting.module.css";
import { type AlertHandler } from "../AppAlert/AppAlert";

type RoutingOutletContext = {
  showAlert: AlertHandler,
};

type AppRoutingProps = {
  context: RoutingOutletContext
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

//? Thanks to React-Router's Outlet component any components rendered via the router
//? gets access to the Routing Context and all objects/funcs it provides
export function useRoutingContext() {
  return useOutletContext<RoutingOutletContext>();
}

export default AppRouting;