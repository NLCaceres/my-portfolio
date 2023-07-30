import { createBrowserRouter } from "react-router-dom";
import App from "../App/App";
import ContactPage from "../ContactMePage";
import PostListView from "../PostListView/PostListView";
import NotFoundPage from "../NotFoundPage/NotFoundPage";

//? Useful for testing and to allow modification before creating a router
export const RouteList = [{
  path: "/",
  Component: App,
  children: [
    { //? This route gets redirected to "portfolio/about-me" in PostListView
      index: true, //? Render this child at the parent's route i.e. "/" in this case
      Component: PostListView
    },
    { //? This might be the one route that needs a more dynamic approach
      path: "contact-me",
      Component: ContactPage
    },
    { //? Might be useful to pre-fetch before rendering, show loadVersion while doing so, and use a NotFoundPage as a fallback
      path: "portfolio/iOS",
      Component: PostListView
    },
    {
      path: "portfolio/android",
      Component: PostListView
    },
    {
      path: "portfolio/front-end",
      Component: PostListView
    },
    {
      path: "portfolio/back-end",
      Component: PostListView
    },
    {
      path: "portfolio/about-me",
      Component: PostListView
    },
    {
      path: "not-found",
      Component: NotFoundPage
    },
    {
      path: "*",
      Component: NotFoundPage
    }
  ]
}];

//? createBrowser will rank routes so order shouldn't matter
const Router = createBrowserRouter(RouteList)

export default Router
