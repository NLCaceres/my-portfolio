import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { animated, useTransition } from "@react-spring/web";
import ContactPage from "../ContactMePage";
import PostListView from "../PostListView/PostListView.js";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import AppRoutingCss from "./AppRouting.module.css";
import ConsoleLogger from "../Utility/Functions/LoggerFuncs";

const AppRouting = ({ viewWidth, submitContactForm }) => {
  //! Animations
  const location = useLocation();
  const transitions = useTransition(location, {
    keys: (item) => item.pathname, //? Prevents multiple Transition rerenders (limiting it nicely to two animating divs)
    from: { transform: 'translate3d(200%,0,0)', opacity: 0 }, enter: { transform: 'translate3d(0%,0,0)', opacity: 1 }, 
    leave: { transform: 'translate3d(-200%,0,0)', opacity: 0, position: "absolute" } //? Give space to newly entering Route
  }); //* Routes do update before leaving, so "contact-me" briefly appears before exiting, while another is entering
  //todo Maybe I could speed up the leave so it's less obvious?

  //! Actual Routes
  const paths = ["iOS", "android", "front-end", "back-end", "about-me"];
  //? 'Routes' must exist nested in a Router somewhere upstream. <Route /> must exist nested in a 'Routes' somewhere upstream
  //? This ensures simple relative pathways where the base 'Routes' = "/" and all 'Routes' inside a <Route path="user"> takes on the prefix "/user"
  return transitions((style) => ( //* No container around the animated.div needed if only the exiting div is position: absolute (AKA out of the HTML doc's flow)
    <animated.div className={AppRoutingCss.animator} style={style}>
      <Routes> {/*//? DON'T add location from useLocation OR item: Location from transitions((style, item) => ()) to <Routes /> 'location' prop */}
        {/*//! It seems ReactRouter may eventually add its own Animation API */}
        { paths.map((pathStr) => { //? Route component dropped 'exact' prop + uses 'element' prop instead of 'children' or 'render' prop for components
            return <Route path={`portfolio/${pathStr}`} key={pathStr} element={<PostListView viewWidth={ viewWidth } />} /> 
          })
        }
        
        <Route path="contact-me" element={<ContactPage viewWidth={ viewWidth } onSubmitForm={ submitContactForm } />} />
        {/*//? 'path' doesn't require leading slash except in the Home: "/" path */}
        <Route path="/" element={<Navigate to="portfolio/about-me" replace />} /> {/*//? Navigate w/ 'replace' replicates old Redirect functionality */}
        {/*//* Need above 'home' route before the next Navigate, or always get 404, highlights the importance of order of routes */}

        <Route path="not-found" element={ <NotFoundPage /> } /> {/*//? Used for following wildcard "*" fallback route */}
        <Route path="*" element={<Navigate to="not-found" replace/>} /> {/*//? Navigate runs a useEffect to nav to "/not-found" */}
      </Routes>
    </animated.div>
  ));
};

export default AppRouting;