import { createBrowserRouter } from "react-router-dom";
import App from "../App/App";
//import ContactPage from "../ContactMePage";
import PostListView from "../PostListView/PostListView";
//import NotFoundPage from "../NotFoundPage/NotFoundPage";
import { createRootRouteWithContext, createRoute, createRouter, getRouteApi, Navigate, notFound } from "@tanstack/react-router";
import { AlertHandler } from "../AppAlert/AppAlert";
import GetPostList from "../Data/Api/ProjectAPI";
import { KebabCaseToTitleCase } from "../Utility/Functions/ComputedProps";

//? Useful for testing and to allow modification before creating a router
export const RouteList = [{
  path: "/",
  Component: App,
  children: [
    { //? This route gets redirected to "portfolio/about-me" in PostListView
      index: true, //? Render this child at the parent's route i.e. "/" in this case
      Component: PostListView
    },
    //{ //? This might be the one route that needs a more dynamic approach
    //  path: "contact-me",
    //  Component: ContactPage
    //},
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
    //{
    //  path: "not-found",
    //  Component: NotFoundPage
    //},
    //{
    //  path: "*",
    //  Component: NotFoundPage
    //}
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
const portfolioChildPaths = ["about-me", "android", "iOS", "front-end", "back-end"] as const;
type portfolioChildPath = typeof portfolioChildPaths[number];
const portfolioComponent = (path: portfolioChildPath) => {
  const fullPath = `/portfolio/${path}` as const; // Treats a simple string as a template literal
  const data = getRouteApi(fullPath).useLoaderData();
  return (
    <div>
      <h1>{KebabCaseToTitleCase(path)}</h1>
      <h3 style={{color: "white"}}>{data?.majorProjects[0].title ?? ""}</h3>
    </div>
  );
};
const postListParam = (path: string) => (path === "about-me") ? "null" : path.replace("-", "_");
const portfolioChildRoute = createRoute({
  getParentRoute: () => portfolioRoute,
  path: "$postId", beforeLoad: (ctx) => {
    if (portfolioChildPaths.find(path => path === ctx.params.postId)) {
      console.log(`Valid match = ${ctx.params.postId}`);
    } else {
      console.log(`Invalid match = ${ctx.params.postId}`); throw notFound();
    }
  },
  component: () => {
    return (
      <div><h1>Portfolio Child Route</h1><h3>Post ID = </h3></div>
    );
  }
});
const aboutMeRoute = createRoute({
	getParentRoute: () => portfolioRoute,
	path: "about-me", // Loader SHOULD include `async` & `await` despite no need since it speeds up
  loader: async (ctx) => await GetPostList(postListParam(ctx.route.path)), // TS type inference
	component: () => portfolioComponent("about-me")
});
const androidRoute = createRoute({
	getParentRoute: () => portfolioRoute,
	path: "android", loader: async (ctx) => await GetPostList(postListParam(ctx.route.path)),
	component: () => portfolioComponent("android")
});
const iOSRoute = createRoute({
	getParentRoute: () => portfolioRoute,
	path: "iOS", loader: async (ctx) => await GetPostList(postListParam(ctx.route.path)),
	component: () => portfolioComponent("iOS")
});
const backEndRoute = createRoute({
	getParentRoute: () => portfolioRoute,
	path: "back-end", loader: async (ctx) => await GetPostList(postListParam(ctx.route.path)),
	component: () => portfolioComponent("back-end")
});
const frontEndRoute = createRoute({
	getParentRoute: () => portfolioRoute,
	path: "front-end", loader: async (ctx) => await GetPostList(postListParam(ctx.route.path)),
	component: () => portfolioComponent("front-end")
});
const contactMeRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "contact-me", // Leading and trailing slashes ignored
}).lazy(() => import("../ContactMePage").then((f) => f.lazyContactMeRoute));
const notFoundRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "not-found"
}).lazy(() => import("../NotFoundPage/NotFoundPage").then((f) => f.lazyNotFoundRoute));
const routeTree = rootRoute.addChildren([
	indexRoute, contactMeRoute, notFoundRoute,
	portfolioRoute.addChildren([portfolioChildRoute,
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
