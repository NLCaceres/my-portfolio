import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { animated, useTransition } from "@react-spring/web";
import ContactPage from "../ContactMePage";
import PostListView from "../PostListView/PostListView";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import AppRoutingCss from "./AppRouting.module.css";
import ConsoleLogger from "../Utility/Functions/LoggerFuncs";

const AppRouting = ({ viewWidth, submitContactForm }) => {
  //! Animations
  const location = useLocation();
  const transitions = useTransition(location, {
    config: { tension: 200, friction: 15 },
    keys: (item) => item.pathname, //? Prevents multiple Transition rerenders (limiting it nicely to two animating divs)
    from: { transform: 'translate3d(200%,0,0)', opacity: 0 }, enter: { transform: 'translate3d(0%,0,0)', opacity: 1 }, 
    leave: { transform: 'translate3d(-200%,0,0)', opacity: 0, position: "absolute" }, //? Give space to newly entering Route
  });
  
  //todo Update to newer 6.4 data API
  //! Actual Routing Components
  const paths = ["iOS", "android", "front-end", "back-end", "about-me"];
  //? 'Routes' must exist nested in a Router somewhere upstream. <Route /> must exist nested in a 'Routes' somewhere upstream
  //? This ensures simple relative pathways where the base 'Routes' = "/" and all 'Routes' inside a <Route path="user"> takes on the prefix "/user"
  return transitions((style, item) => ( //* No container around the animated.div needed if only the exiting div is position: absolute (AKA out of the HTML doc's flow)
    <animated.div className={AppRoutingCss.animator} style={style}>
      <Routes location={item}> {/*//? By removing <Navigate />, using "location" prop no longer stalls tests w/ infinite redirects/rerenders */}
        {/*//! It seems ReactRouter may eventually add its own Animation API */}
        { paths.map((pathStr) => { //? Route component dropped 'exact' prop + uses 'element' prop instead of 'children' or 'render' prop for components
            return <Route path={`portfolio/${pathStr}`} key={pathStr} element={<PostListView viewWidth={ viewWidth } />} /> 
          })
        }
        
        <Route path="contact-me" element={<ContactPage viewWidth={ viewWidth } onSubmitForm={ submitContactForm } />} />
        {/*//? 'path' doesn't require leading slash except in the Home: "/" path */}
        <Route path="/" element={<PostListView viewWidth={ viewWidth } />} /> {/* Drop <Navigate /> to use window.history.replaceState to simulate Redirects */}
        {/*//* Need above 'home' route before "*" wildcard, or always get 404, highlights the importance of order of routes */}

        <Route path="not-found" element={ <NotFoundPage /> } /> {/*//? Used for following wildcard "*" fallback route */}
        <Route path="*" element={<NotFoundPage />} /> {/* Let window.history.replaceState update URL to "/not-found", no true redirect, no extra rerenders */}
      </Routes>
    </animated.div>
  ));
};

export default AppRouting;