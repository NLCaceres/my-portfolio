import { createBrowserRouter } from "react-router-dom";
import App from "../App/App";
import ContactPage from "../ContactMePage";
import PostListView from "../PostListView/PostListView";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import { createRootRouteWithContext, createRoute, createRouter, Navigate } from "@tanstack/react-router";
import { AlertHandler } from "../AppAlert/AppAlert";

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
const Router = createBrowserRouter(RouteList);

export default Router;

//! TanStack Implementation

type AppRouterContext = {
	showAlert: AlertHandler
};
const rootRoute = createRootRouteWithContext<AppRouterContext>()({
	component: () => <App />
});
const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: () => <Navigate to="/portfolio/about-me" replace={true} />
});
const portfolioRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "portfolio"
});
const portfolioIndexRoute = createRoute({
	getParentRoute: () => portfolioRoute,
	path: "/",
	component: () => <Navigate to="/portfolio/about-me" replace={true} />
});
const aboutMeRoute = createRoute({
	getParentRoute: () => portfolioRoute,
	path: "about-me",
	component: () => <h1>About Me</h1>
});
const androidRoute = createRoute({
	getParentRoute: () => portfolioRoute,
	path: "android",
	component: () => <h1>Android</h1>
});
const iOSRoute = createRoute({
	getParentRoute: () => portfolioRoute,
	path: "iOS",
	component: () => <h1>iOS</h1>
});
const backEndRoute = createRoute({
	getParentRoute: () => portfolioRoute,
	path: "back-end",
	component: () => <h1>Back end</h1>
});
const frontEndRoute = createRoute({
	getParentRoute: () => portfolioRoute,
	path: "front-end",
	component: () => <h1>Front End</h1>
});
const contactMeRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "contact-me", // Leading and trailing slashes ignored
	component: ContactPage
});
const notFoundRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "not-found",
	component: NotFoundPage
});
const routeTree = rootRoute.addChildren([
	indexRoute, contactMeRoute, notFoundRoute,
	portfolioRoute.addChildren([
		portfolioIndexRoute, aboutMeRoute, androidRoute, iOSRoute, backEndRoute, frontEndRoute
	])
]);

export const TanStackRouter = createRouter({
	routeTree,
	scrollRestoration: true,
	defaultNotFoundComponent: () => <Navigate to="/not-found" replace={true} />,
	context: { showAlert: () => {} }
});

declare module "@tanstack/react-router" {
  interface Register { // eslint-disable-line
    router: typeof TanStackRouter
  }
}
