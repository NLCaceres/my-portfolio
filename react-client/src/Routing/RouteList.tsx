import App from "../App/App";
import { AlertHandler } from "../AppAlert/AppAlert";
import GetPostList from "../Data/Api/ProjectAPI";
import PostListView from "../PostListView/PostListView";
import { createRootRouteWithContext, createRoute, createRouter, getRouteApi, Navigate, notFound } from "@tanstack/react-router";

type AppRouterContext = {
	showAlert: AlertHandler
};
const rootRoute = createRootRouteWithContext<AppRouterContext>()({
	component: () => <App />
});
const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: () =>
  <Navigate to="/portfolio/$postId" params={{ postId: "about-me" }} replace={true} />
});


//! Portfolio Routes
const portfolioRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "portfolio"
});
const portfolioIndexRoute = createRoute({
	getParentRoute: () => portfolioRoute,
	path: "/",
	component: () =>
  <Navigate to="/portfolio/$postId" params={{ postId: "about-me" }} replace={true} />
});
export const portfolioRoutesAPI = getRouteApi("/portfolio/$postId");
const portfolioChildPaths = ["about-me", "android", "iOS", "front-end", "back-end"] as const;
const portfolioChildRoute = createRoute({
  getParentRoute: () => portfolioRoute, path: "$postId",
  beforeLoad: ({ params }) => {
    if (!portfolioChildPaths.find(path => path.toLowerCase() === params.postId.toLowerCase())) {
			throw notFound();
		}
  },
  loader: async ({ params: { postId }}) =>
		GetPostList((postId === "about-me") ? "null" : postId.replace("-", "_")),
  component: PostListView
});


//! Misc Routes
export const contactMeRouteAPI = getRouteApi("/contact-me");
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
	portfolioRoute.addChildren([portfolioChildRoute, portfolioIndexRoute])
]);
const TanStackRouter = createRouter({
	routeTree,
	scrollRestoration: true,
	defaultNotFoundComponent: () => <Navigate to="/not-found" replace={true} />,
	context: { showAlert: () => {} }
});
export default TanStackRouter;

declare module "@tanstack/react-router" {
  interface Register { // eslint-disable-line
    router: typeof TanStackRouter
  }
}
