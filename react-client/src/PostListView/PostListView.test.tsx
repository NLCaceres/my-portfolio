import { vi, type MockInstance } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectFactory from "../Utility/TestHelpers/ProjectFactory";
import { averageTabletLowEndWidth, averageTabletViewWidth, smallTabletHighEndWidth } from "../Utility/Constants/Viewports";
import * as GetPostList from "../Data/Api/ProjectAPI";
import * as ProjectHelpers from "../Data/Models/Project";
import * as DialogProvider from "../ContextProviders/DialogProvider";
import * as ViewWidthContext from "../ContextProviders/ViewWidthProvider";
import { createRootRoute, createRoute, createRouter, Outlet, RouterProvider } from "@tanstack/react-router";
import { Globals } from "@react-spring/web";
import PostListView from "./PostListView";

const testRouter = () => {
  const rootRoute = createRootRoute({ component: Outlet });
  const portfolioRoute = createRoute({
    getParentRoute: () => rootRoute, path: "/portfolio/$postId",
    component: PostListView, loader: ({ params }) => GetPostList.default(params.postId)
  });
  return createRouter({ routeTree: rootRoute.addChildren([portfolioRoute]) });
};
beforeAll(() => { Globals.assign({ skipAnimation: true }); });
describe("renders a list of bootstrap cards filled with post objs", () => {
  let ApiMock: MockInstance; let ViewWidthMock: MockInstance;
  let ProjectSortingMock: MockInstance;
  beforeEach(() => {
    ApiMock = vi.spyOn(GetPostList, "default");
    ViewWidthMock = vi.spyOn(ViewWidthContext, "default").mockReturnValue(averageTabletViewWidth);
    ProjectSortingMock = vi.spyOn(ProjectHelpers, "SortProjects");
  });
  afterEach(() => {
    ApiMock.mockRestore();
    ViewWidthMock.mockRestore();
    ProjectSortingMock.mockRestore();
  });

  test("only if the list has a set of major or minor projects", async () => {
    const majProject = ProjectFactory.create(); const minProject = ProjectFactory.create();
    ApiMock.mockResolvedValue({ majorProjects: [majProject], minorProjects: [minProject] });
    const router = testRouter();
    await router.navigate({ to: "/portfolio/$postId", params: { postId: "android" } });
    render(<RouterProvider router={router} />);
    expect(await screen.findByRole("heading", { name: /major projects/i })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: /small projects/i })).toBeInTheDocument();
    expect(ApiMock).toHaveBeenCalledTimes(2);
    expect(ProjectSortingMock).toHaveBeenCalledTimes(2); //* Once for major and once for minor projects
    //unmount();

    ApiMock.mockResolvedValue({ majorProjects: [majProject] });
    await waitFor(() => router.invalidate());
    //expect(await screen.findByText("iOS")).toBeInTheDocument();
    //const { unmount: secondUnmount } = render(<RouterProvider router={TanStackRouter} />);
    expect(await screen.findByRole("heading", { name: /major projects/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /small projects/i })).not.toBeInTheDocument();
    expect(ApiMock).toHaveBeenCalledTimes(3);
    expect(ProjectSortingMock).toHaveBeenCalledTimes(3);
    expect(ProjectSortingMock).toHaveBeenLastCalledWith([majProject]); //* Last called with undefined minorProjects so default [] value is used
    //secondUnmount();

    //* Following set fails because ln81 (not using key to set title, using index from Object.values()!)
    ApiMock.mockResolvedValue({ minorProjects: [minProject] });
    await waitFor(() => router.invalidate());
    //const { unmount: thirdUnmount } = render(<RouterProvider router={TanStackRouter} />);
    expect(await screen.findByRole("heading", { name: /small projects/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /major projects/i })).not.toBeInTheDocument();
    expect(ApiMock).toHaveBeenCalledTimes(4);
    expect(ProjectSortingMock).toHaveBeenCalledTimes(4);
    expect(ProjectSortingMock).toHaveBeenNthCalledWith(4, [minProject]); //* Called with undefined majorProjects so default [] used
    //unmount();
    //thirdUnmount();

    ApiMock.mockResolvedValue({ majorProjects: [], minorProjects: [] });
    await waitFor(() => router.invalidate());
    //const { unmount: fourthUnmount } = render(<RouterProvider router={TanStackRouter} />);
    const placeholders = await screen.findAllByRole("heading"); //* Need to await placeholder heading elems or the ln43 render sets off act() warning
    expect(placeholders.length).toBe(6); //* 6 headers are found -> 2 titles + 4 titles in individual placeholder cards
    const placeholderImgs = screen.getAllByRole("heading", { name: /project/i }); //* Find 4 PlaceholderImg components
    expect(placeholderImgs).toHaveLength(4); //* That render a div containing a h2 tag with "Project" written
    for (const placeholderImg of placeholderImgs) { expect(placeholderImg).toHaveClass("placeholderText"); } //* All have the class "placeholderText"
    expect(screen.queryByRole("heading", { name: /(major|small) projects/i })).not.toBeInTheDocument(); //* No PostListView actually renders
    expect(ApiMock).toHaveBeenCalledTimes(5);
    expect(ProjectSortingMock).toHaveBeenCalledTimes(4);
    expect(ProjectSortingMock).toHaveBeenNthCalledWith(4, [minProject]);
    //expect(ProjectSortingMock).toHaveBeenNthCalledWith(9, []); //* BOTH major and minor projects are empty arrays
    //expect(ProjectSortingMock).toHaveBeenLastCalledWith([]); //* So 9th time is always called with an empty array
    //secondUnmount();

    ApiMock.mockImplementation(() => ({}));
    await waitFor(() => router.invalidate());
    //* Same as with empty arrays. Just get placeholders
    expect((await screen.findAllByRole("heading")).length).toBe(6); //* Still expect 6 titles heading elems
    const morePlaceholderImgs = await screen.findAllByRole("heading", { name: /project/i }); //* 4 with class "placeholderText"
    expect(morePlaceholderImgs).toHaveLength(4);
    for (const placeholderImg of morePlaceholderImgs) { expect(placeholderImg).toHaveClass("placeholderText"); }
    expect(screen.queryByRole("heading", { name: /(major|small) projects/i })).not.toBeInTheDocument();
    expect(ApiMock).toHaveBeenCalledTimes(6);
    expect(ProjectSortingMock).toHaveBeenCalledTimes(4);
    expect(ProjectSortingMock).toHaveBeenNthCalledWith(4, [minProject]);
    //expect(ProjectSortingMock).toHaveBeenNthCalledWith(11, undefined); //* BOTH undefined minor and major projects so [] used
    //expect(ProjectSortingMock).toHaveBeenLastCalledWith(undefined); //* So 11th time is also called with an empty array
  });
  describe("that depends on viewWidth for rendering", () => {
    test("a dialog for multi-image posts", async () => {
      const showDialogMock = vi.fn();
      vi.spyOn(DialogProvider, "default").mockReturnValue({ showDialog: showDialogMock });
      const imgSortSpy = vi.spyOn(ProjectHelpers, "SortProjectImagesByImportance");
      const twoImgProj = ProjectFactory.create(2); const oneImgProj = ProjectFactory.create(1);
      const twoImgAltText = twoImgProj.post_images![0].alt_text;
      const oneImgAltText = oneImgProj.post_images![0].alt_text;
      ApiMock.mockImplementation(() => (
        { majorProjects: [twoImgProj, ProjectFactory.create()], minorProjects: [oneImgProj] })
      );
      const user = userEvent.setup();
      expect(imgSortSpy).not.toHaveBeenCalled(); // Double check image sort not somehow called
      const router = testRouter();
      await router.navigate({ to: "/portfolio/$postId", params: { postId: "iOS" } });
      render(<RouterProvider router={router} />);
      // WHEN multi-image project image clicked at widths >= 768
      await user.click(await screen.findByRole("img", { name: twoImgAltText }));
      //  THEN `showDialog` run, opening the modal
      expect(showDialogMock).toHaveBeenCalledOnce();
      // AND `<AppCarousel>` renders with title and sorted images
      expect(imgSortSpy).toHaveBeenCalledExactlyOnceWith(twoImgProj.post_images);
      // WHENEVER the multi-image project `<CardImage>` clicked
      await user.click(await screen.findByRole("img", { name: twoImgAltText }));
      // THEN `showDialog` run, rendering `<AppCarousel` with re-sorted images
      expect(showDialogMock).toHaveBeenCalledTimes(2);
      expect(imgSortSpy).toHaveBeenNthCalledWith(2, twoImgProj.post_images);
      expect(imgSortSpy).toHaveBeenCalledTimes(2);

      // WHEN single img project clicked at width >= 768
      await user.click(await screen.findByRole("img", { name: oneImgAltText }));
      // THEN `showDialog(false)` run, NOT opening the modal dialog
      expect(showDialogMock).toHaveBeenCalledTimes(3);
      expect(showDialogMock).toHaveBeenLastCalledWith(false);
      // AND so no image sort needed by `<AppCarousel>`
      expect(imgSortSpy).toHaveBeenNthCalledWith(2, twoImgProj.post_images);
      expect(imgSortSpy).toHaveBeenCalledTimes(2);

      ViewWidthMock.mockReturnValue(smallTabletHighEndWidth);
      await waitFor(() => router.invalidate());
      // WHEN a multi-image project clicked at widths < 768 (mobile/tablet)
      await user.click(await screen.findByRole("img", { name: twoImgAltText }));
      // THEN no modal is rendered after click, even though it's multi-image
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      // SINCE multi-image projects renders `<AppCarousel>` at smaller widths & without `onClick`
      expect(showDialogMock).toHaveBeenCalledTimes(3);
      expect(showDialogMock).toHaveBeenLastCalledWith(false);
      // AND since `<AppCarousel>` rendered at smaller widths, the image sort is run
      expect(imgSortSpy).toHaveBeenNthCalledWith(3, twoImgProj.post_images);
      expect(imgSortSpy).toHaveBeenCalledTimes(3);
      // WHEN a single-image project clicked at widths < 768 (mobile/tablet)
      await user.click(await screen.findByRole("img", { name: oneImgAltText }));
      // THEN `showDialog(false)` run again
      expect(showDialogMock).toHaveBeenCalledTimes(4);
      expect(showDialogMock).toHaveBeenLastCalledWith(false);
    });
    test("a different size title", async () => {
      ApiMock.mockImplementation(() => (
        { majorProjects: [ProjectFactory.create()], minorProjects: [] })
      );
      const router = testRouter();
      await waitFor(() =>
        router.navigate({ to: "/portfolio/$postId", params: { postId: "foobar-title" } })
      );
      render(<RouterProvider router={router} />);
      const mainTitle = await screen.findByRole("heading", { name: /foobar title/i }); //* Title in PostListView component aka iOS, android, etc...
      expect(mainTitle).toHaveClass("display-2");
      const projectSectionTitle = screen.getAllByRole("heading", { name: /projects/i }); //* Either about-me or major/minor in ProjectList component
      for (const projectSectionType of projectSectionTitle) {
        expect(projectSectionType).toHaveClass("display-2");
      }

      ViewWidthMock.mockReturnValue(averageTabletLowEndWidth);
      await waitFor(() => router.invalidate());
      expect(mainTitle).toHaveClass("display-3"); //* Above 768 - slightly decrease font sizes
      for (const projectSectionType of projectSectionTitle) {
        expect(projectSectionType).toHaveClass("display-3");
      }
    });
  });
  test("with title and subtitle headings set by URL location param", async () => {
    ApiMock.mockImplementation(() => ({ majorProjects: [ProjectFactory.create()] }));
    const router = testRouter();
    await waitFor(() => // WHEN the URL param is a simple word, "foobar"
      router.navigate({ to: "/portfolio/$postId", params: { postId: "foobar" } })
    );
    render(<RouterProvider router={router} />);
    // THEN the title heading is the title cased version of the param, "Foobar"
    expect(await screen.findByRole("heading", { name: "Foobar" })).toBeInTheDocument();

    await waitFor(() => // WHEN the URL parameter contains a slash
      router.navigate({ to: "/portfolio/$postId", params: { postId: "foobar/barfoo" } })
    ); // THEN the title heading should contain that slash BUT won't since it'd redirect in prod
    expect(await screen.findByRole("heading", { name: "Foobar/barfoo" }))
      .toHaveTextContent("Foobar/barfoo");

    // In prod, a URL param "containing" a slash would redirect to "Not Found" just like this
    await waitFor(() => router.navigate({ href: "/portfolio/foobar/barfoo" }));
    expect(await screen.findByText("Not Found")).toBeInTheDocument();

    await waitFor(() => // WHEN the URL param is "about-me"
      router.navigate({ to: "/portfolio/$postId", params: { postId: "about-me" } })
    ); // THEN the title = "About Me", and subtitle = "Nicholas", not "Major/Small projects"
    expect(await screen.findByRole("heading", { name: "About Me" }))
      .toHaveTextContent("About Me");
    expect(screen.getByRole("heading", { name: /nicholas/i }));
  });
});
