import { useLocation, Outlet } from "@tanstack/react-router";
import { animated, useTransition } from "@react-spring/web";
import AppRoutingCss from "./AppRouting.module.css";

const AppRouting = () => {
  const location = useLocation();
  const transitions = useTransition(location, {
    config: { tension: 200, friction: 15 },
    keys: (item) => item.pathname, //? Ensures ONLY 2 divs animated / rendered
    from: { transform: "translate3d(200%,0,0)", opacity: 0 },
    enter: { transform: "translate3d(0%,0,0)", opacity: 1 }, //? Position adds space to new route
    leave: { transform: "translate3d(-200%,0,0)", opacity: 0, position: "absolute" as const },
  });

  //* No wrapper needed around animated.div IF exiting div has position to move it out of flow
  return transitions(style => (
    <animated.div className={AppRoutingCss.animator} style={style}>
      <Outlet />
    </animated.div>
  ));
};

export default AppRouting;
