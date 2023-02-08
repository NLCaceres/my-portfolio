import React from "react";
import PostListView from "./PostListView";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectFactory from "../Utility/Functions/Tests/ProjectFactory";
import * as GetPostList from "../Api/ProjectAPI";
import { averageTabletLowEndWidth, averageTabletViewWidth, smallTabletHighEndWidth } from "../Utility/Constants/Viewports";
import { BrowserRouter, MemoryRouter } from "react-router-dom";

describe("renders a list of bootstrap cards filled with post objs", () => {
  let ApiMock;
  beforeEach(() => {
    ApiMock = jest.spyOn(GetPostList, "default")
  })
  afterEach(() => { ApiMock.mockRestore() })

  test("only if the list has a set of major or minor projects", async () => {
    const majProject = ProjectFactory.create(); const minProject = ProjectFactory.create();
    ApiMock.mockImplementation(() => ({ majorProjects: [majProject], minorProjects: [minProject] }) );
    const { unmount } = render(<PostListView />, { wrapper: BrowserRouter });
    expect(await screen.findByRole("heading", { name: /major projects/i })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: /small projects/i })).toBeInTheDocument();
    unmount();

    ApiMock.mockImplementation(() => ({ majorProjects: [majProject] }) );
    const { unmount: secondUnmount } = render(<PostListView />, { wrapper: BrowserRouter });
    expect(await screen.findByRole("heading", { name: /major projects/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /small projects/i })).not.toBeInTheDocument();
    secondUnmount();

    //* Following set fails because ln81 (not using key to set title, using index from Object.values()!)
    ApiMock.mockImplementation(() => ({ minorProjects: [minProject] }) );
    const { unmount: thirdUnmount } = render(<PostListView />, { wrapper: BrowserRouter });
    expect(await screen.findByRole("heading", { name: /small projects/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /major projects/i })).not.toBeInTheDocument();
    thirdUnmount();

    ApiMock.mockImplementation(() => ({ majorProjects: [], minorProjects: [] }) );
    const { unmount: fourthUnmount } = render(<PostListView />, { wrapper: BrowserRouter }); //* Don't unmount since component is empty anyway
    const placeholders = await screen.findAllByRole("heading"); //* Need to await placeholder heading elems or the ln43 render sets off act() warning
    expect(placeholders.length).toBe(6); //* 6 headers are found -> 2 titles + 4 titles in individual placeholder cards
    const placeholderImgs = screen.getAllByRole("heading", { name: /project/i }); //* Find 4 PlaceholderImg components
    expect(placeholderImgs).toHaveLength(4); //* That render a div containing a h2 tag with "Project" written
    for (const placeholderImg of placeholderImgs) { expect(placeholderImg).toHaveClass("placeholderText") } //* All have the class 'placeholderText'
    expect(await screen.queryByRole("heading", { name: /(major|small) projects/i })).not.toBeInTheDocument(); //* No PostListView actually renders
    fourthUnmount();

    ApiMock.mockImplementation(() => ({}) );
    render(<PostListView />, { wrapper: BrowserRouter }); //* Same as with empty arrays. Just get placeholders
    expect((await screen.findAllByRole("heading")).length).toBe(6); //* Still expect 6 titles heading elems
    const morePlaceholderImgs = screen.getAllByRole("heading", { name: /project/i }); //* 4 with class 'placeholderText'
    expect(morePlaceholderImgs).toHaveLength(4);
    for (const placeholderImg of morePlaceholderImgs) { expect(placeholderImg).toHaveClass("placeholderText") }
    expect(screen.queryByRole("heading", { name: /(major|small) projects/i })).not.toBeInTheDocument();
  })
  describe("that depends on viewWidth for rendering", () => {
    test("a modal for multi-image posts", async () => {
      const twoImgProj = ProjectFactory.create(2); const noImgProj = ProjectFactory.create(); const oneImgProj = ProjectFactory.create(1);
      ApiMock.mockImplementation(() => ({ majorProjects: [twoImgProj, noImgProj], minorProjects: [oneImgProj] }) );
      const user = userEvent.setup();
      const { rerender } = render(
        <MemoryRouter initialEntries={["/foobar-title"]}> <PostListView viewWidth={averageTabletViewWidth} /> </MemoryRouter>
      );
      await user.click(await screen.findByRole("img", { name: twoImgProj.post_images[0].alt_text })); //* Use click to make modal appear
      const modalOpenFirstTime = screen.getByRole("dialog");
      expect(modalOpenFirstTime).toBeInTheDocument(); expect(modalOpenFirstTime).toHaveClass("show"); //* Modal mounted and it's visible
      await user.click(screen.getByRole("button", { name: /close/i })); //* Close the modal

      //* Only have 1 img so a condition in ProjectSection says don't render a modal, just render an img
      await user.click(await screen.findByRole("img", { name: oneImgProj.post_images[0].alt_text })); //* Only 1 image in [] so click doesn't work
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(); //* Modal long gone

      rerender(<MemoryRouter initialEntries={["/foobar-title"]}> <PostListView viewWidth={smallTabletHighEndWidth} /> </MemoryRouter>);
      await user.click(await screen.findByRole("img", { name: twoImgProj.post_images[0].alt_text })); 
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(); //* No modal renders since viewWidth < 768
      await user.click(await screen.findByRole("img", { name: oneImgProj.post_images[0].alt_text }));
      //* Still no modal renders since two conditions fail in single img project post: viewWidth too small AND post only has 1 img
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    })
    test("a zigzag pattern with the post cards", async () => {
      const projectOne = ProjectFactory.create(); const projectTwo = ProjectFactory.create(); const smallProj = ProjectFactory.create();
      ApiMock.mockImplementation(() => ({ majorProjects: [projectOne, projectTwo], minorProjects: [smallProj] }) );

      const { rerender } = render(
        <MemoryRouter initialEntries={["/foobar-title"]}> <PostListView viewWidth={averageTabletViewWidth} /> </MemoryRouter>
      );
      const postCardRows = await screen.findAllByTestId("post-card-row"); //* Only odd rows are reversed
      for (let i = 0; i < postCardRows.length; i++) (i % 2 === 0) ? //* Order matters so "for in" not an option 
        expect(postCardRows[i]).not.toHaveClass("flex-row-reverse") : expect(postCardRows[i]).toHaveClass("flex-row-reverse");

      rerender(<MemoryRouter initialEntries={["/foobar-title"]}> <PostListView viewWidth={smallTabletHighEndWidth} /> </MemoryRouter>);
      for (const postCardRow of screen.getAllByTestId("post-card-row")) { expect(postCardRow).not.toHaveClass("flex-row-reverse") }
    })
    test("a different size title", async () => {
      ApiMock.mockImplementation(() => ({ majorProjects: [ProjectFactory.create()], minorProjects: [] }) );

      const { rerender } = render(
        <MemoryRouter initialEntries={["/foobar-title"]}> <PostListView viewWidth={averageTabletViewWidth} /> </MemoryRouter>
      );
      const mainTitle = await screen.findByRole("heading", { name: /foobar title/i }); //* Title in PostListView component aka iOS, android, etc...
      expect(mainTitle).toHaveClass("display-2");
      const projectSectionTitle = screen.getAllByRole("heading", { name: /projects/i }); //* Either about-me or major/minor in ProjectList component
      for (const projectSectionType of projectSectionTitle) { expect(projectSectionType).toHaveClass("display-2") }

      rerender(<MemoryRouter initialEntries={["/foobar-title"]}> <PostListView viewWidth={averageTabletLowEndWidth} /> </MemoryRouter>); 
      expect(mainTitle).toHaveClass("display-3"); //* Above 768 - slightly decrease font sizes
      for (const projectSectionType of projectSectionTitle) { expect(projectSectionType).toHaveClass("display-3") }
    })
  })
  test("that depends on a url location prop to set headers", async () => {
    ApiMock.mockImplementation(() => ({ majorProjects: [ProjectFactory.create()] }) );
    const { unmount } = render(<MemoryRouter initialEntries={["/foobar"]}> <PostListView /> </MemoryRouter>);
    expect(await screen.findByRole("heading", { name: "Foobar" })).toBeInTheDocument();
    unmount();

    const { unmount: nextUnmount } = render(<MemoryRouter initialEntries={["/foo/barfoo"]}> <PostListView /> </MemoryRouter>);
    expect(await screen.findByRole("heading", { name: "Barfoo" })).toHaveTextContent("Barfoo"); //* Just uses deepest directory ("/barfoo" here)
    nextUnmount();

    const { unmount: thirdUnmount } = render(<MemoryRouter initialEntries={["/foo/bar/foobar/foobar-barfoo"]}> <PostListView /> </MemoryRouter>);
    expect(await screen.findByRole("heading", { name: "Foobar Barfoo" })).toHaveTextContent("Foobar Barfoo"); //* Also separates hyphenated urls
    thirdUnmount();

    const { unmount: fourthUnmount } = render(<MemoryRouter initialEntries={["/foo/bar/hello/"]}> <PostListView /> </MemoryRouter>);
    expect(await screen.findByRole("heading", { name: "Hello" })).toHaveTextContent("Hello"); //* Remove trailing slash to get last section
    fourthUnmount(); //* Instead of getting "hello/" or just "" from the empty section after "hello/", SHOULD GET "hello" as expected

    const { unmount: finalUnmount } = render(<MemoryRouter initialEntries={["/about-me"]}> <PostListView /> </MemoryRouter>);
    expect(await screen.findByRole("heading", { name: "About Me" })).toHaveTextContent("About Me"); //! Special about-me case
    expect(screen.getByRole("heading", { name: /nicholas/i }));
    finalUnmount();

    render(<MemoryRouter initialEntries={[""]}> <PostListView /> </MemoryRouter>); //* W/out a location prop - title header is empty
    const projectList = await screen.findByRole("heading", { name: "Major Projects" }) //* Should still render ProjectList component
    const title = projectList.parentElement.previousElementSibling || projectList.parentElement.nextElementSibling; 
    expect(title).toBe(null) //* prevElem & nextElem above should BOTH return null since projectList's container div won't have its usual title sibling
    //* If render had a viewWidth prop w/ >= 768, then prevSibling might return CardImgModal BUT w/ an undefined viewWidth, its render condition fails
  })
})
