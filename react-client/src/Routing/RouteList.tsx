import App from "../App/App";
import PostListView from "../PostListView/PostListView";
import { createRootRouteWithContext, createRoute, createRouter, getRouteApi, Navigate, notFound } from "@tanstack/react-router";
import { AlertHandler } from "../AppAlert/AppAlert";
import GetPostList from "../Data/Api/ProjectAPI";
// import { SortProjects } from "../Data/Models/Project";

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
const portfolioChildPaths = ["about-me", "android", "iOS", "front-end", "back-end"] as const;
const validPortfolioPath = (actualPath: string) =>
  portfolioChildPaths.find(path => path.toLowerCase() === actualPath.toLowerCase());
const postListParam = (path: string) => (path === "about-me") ? "null" : path.replace("-", "_");
export const portfolioRoutesAPI = getRouteApi("/portfolio/$postId");
const portfolioChildRoute = createRoute({
  getParentRoute: () => portfolioRoute, path: "$postId",
  beforeLoad: ({ params }) => {
    if (!validPortfolioPath(params.postId)) throw notFound();
  },
  loader: async ({ params }) => {
    const projects = await GetPostList(postListParam(params.postId));
    //SortProjects(projects.majorProjects);
    //SortProjects(projects.minorProjects);
    return projects;
  },
  component: PostListView
});
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
