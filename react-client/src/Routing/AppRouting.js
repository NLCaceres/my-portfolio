import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ContactPage from "../ContactMePage";
import PostListView from "../PostListView/PostListView.js";
import NotFoundPage from "../NotFoundPage/NotFoundPage";

const AppRouting = ({ viewWidth, submitContactForm }) => {
  const paths = ["iOS", "android", "front-end", "back-end", "about-me"];
  return ( //? 'Routes' must exist nested in a Router somewhere upstream. <Route /> must exist nested in a 'Routes' somewhere upstream
    //? This ensures simple relative pathways where the base 'Routes' = "/" and all 'Routes' inside a <Route path="user"> takes on the prefix "/user"
    <Routes>
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
  );
};

export default AppRouting;