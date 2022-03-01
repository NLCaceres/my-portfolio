import React from 'react';
import PostListView from "./PostListView";
import { render, screen, prettyDOM } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProjectFactory from '../Utility/Functions/Tests/ProjectFactory';
import * as Api from '../Utility/Functions/Api';
import { averageTabletViewWidth, smallTabletHighEndWidth } from "../Utility/Constants/Viewports";

describe("renders a list of bootstrap cards filled with post objs", () => {
  test("only if the list has a set of major or minor projects", async () => {
    const majProject = ProjectFactory.create(); const minProject = ProjectFactory.create();
    const ApiMock = jest.spyOn(Api, 'default').mockImplementation(() => ({ majorProjects: [majProject], minorProjects: [minProject] }) );
    const { unmount } = render(<PostListView />);
    expect(await screen.findByRole('heading', { name: /major projects/i })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: /small projects/i })).toBeInTheDocument();
    unmount();

    ApiMock.mockImplementation(() => ({ majorProjects: [majProject] }) );
    const { unmount: secondUnmount } = render(<PostListView />);
    expect(await screen.findByRole('heading', { name: /major projects/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /small projects/i })).not.toBeInTheDocument();
    secondUnmount();

    //* Following set fails because ln81 (not using key to set title, using index from Object.values()!)
    ApiMock.mockImplementation(() => ({ minorProjects: [minProject] }) );
    const { unmount: thirdUnmount } = render(<PostListView />);
    expect(await screen.findByRole('heading', { name: /small projects/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /major projects/i })).not.toBeInTheDocument();
    thirdUnmount();

    ApiMock.mockImplementation(() => ({ majorProjects: [], minorProjects: [] }) );
    const { unmount: fourthUnmount } = render(<PostListView />); //* Don't unmount since component is empty anyway
    expect(await screen.findByRole('heading', { name: /sorry/i })).toBeInTheDocument();
    expect(await screen.queryByRole('heading', { name: /major projects/i })).not.toBeInTheDocument();
    expect(await screen.queryByRole('heading', { name: /small projects/i })).not.toBeInTheDocument();
    fourthUnmount();

    ApiMock.mockImplementation(() => ({}) );
    render(<PostListView />); //* Same as with empty arrays
    expect(await screen.findByRole('heading', { name: /sorry/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /major projects/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /small projects/i })).not.toBeInTheDocument();

    ApiMock.mockRestore();
  })
  test("that depends on viewWidth to render a modal and zigzag post cards", async () => {
    const twoImgProj = ProjectFactory.create(2); const noImgProj = ProjectFactory.create(); const oneImgProj = ProjectFactory.create(1);
    const ApiMock = jest.spyOn(Api, 'default').mockImplementation(() => ({ majorProjects: [twoImgProj, noImgProj], minorProjects: [oneImgProj] }) );
    const OpenModalSpy = jest.spyOn(PostListView.prototype, 'openModal');
    const user = userEvent.setup();

    const { rerender } = render(<PostListView viewWidth={averageTabletViewWidth} />);
    await user.click(await screen.findByRole('img', { name: twoImgProj.post_images[0].alt_text })); //* Use click to make modal appear
    expect(OpenModalSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('dialog')).toBeInTheDocument(); expect(screen.getByRole('dialog')).toHaveClass('show'); //* Modal mounted + visible
    await user.click(screen.getByRole('button', { name: /close/i }));
    expect(OpenModalSpy).toHaveBeenCalledTimes(2); //* Since waitFor/waitForElem... is so inconsistent just monitor spy

    await user.click(await screen.findByRole('img', { name: oneImgProj.post_images[0].alt_text })); //* Only 1 image in [] so click doesn't work
    expect(OpenModalSpy).toHaveBeenCalledTimes(2); //* Spy not called since 1 img (condition in ProjectSection)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); //* Modal long gone

    const postCardRows = screen.getAllByTestId('post-card-row'); //* Only odd rows are reversed
    for (let i = 0; i < postCardRows.length; i++) (i % 2 === 0) ? //* Order matters so 'for in' not an option 
      expect(postCardRows[i]).not.toHaveClass('flex-row-reverse') : expect(postCardRows[i]).toHaveClass('flex-row-reverse');

    rerender(<PostListView viewWidth={smallTabletHighEndWidth} />);
    await user.click(await screen.findByRole('img', { name: twoImgProj.post_images[0].alt_text })); 
    expect(OpenModalSpy).toHaveBeenCalledTimes(2); //* Spy not called since viewWidth < 768
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(await screen.findByRole('img', { name: oneImgProj.post_images[0].alt_text }));
    expect(OpenModalSpy).toHaveBeenCalledTimes(2); //* Spy fails both viewWidth and > 1 img condition
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    for (const postCardRow of screen.getAllByTestId('post-card-row')) expect(postCardRow).not.toHaveClass('flex-row-reverse')

    ApiMock.mockRestore(); OpenModalSpy.mockRestore();
  })
  test("that depends on a url location prop to set headers", async () => {
    const ApiMock = jest.spyOn(Api, 'default').mockImplementation(() => ({ majorProjects: [ProjectFactory.create()] }) );
    const urlLocation = { pathname: '/foobar' };
    const { rerender } = render(<PostListView location={urlLocation} />);
    const titleHeader = await screen.findByRole('heading', { name: 'Foobar' });
    expect(titleHeader).toBeInTheDocument();

    const nestedLocation = { pathname: '/foo/barfoo' };
    rerender(<PostListView location={nestedLocation} />);
    expect(titleHeader).toHaveTextContent('Barfoo'); //* Just uses deepest directory ('/barfoo' here)
    const deeplyNestedLocation = { pathname: '/foo/bar/foobar/foobar-barfoo' };
    rerender(<PostListView location={deeplyNestedLocation} />);
    expect(titleHeader).toHaveTextContent('Foobar Barfoo'); //* Also separates hyphenated urls

    const aboutMeLocation = { pathname: '/about-me' };
    rerender(<PostListView location={aboutMeLocation} />);
    expect(titleHeader).toHaveTextContent('About Me'); //! Special about-me case
    expect(screen.getByRole('heading', { name: /nicholas/i }));

    rerender(<PostListView />); //* W/out a location prop - title header is empty
    expect(titleHeader).not.toBeInTheDocument();

    ApiMock.mockRestore();
  })
})
