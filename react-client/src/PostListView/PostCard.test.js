import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import PostCard from './PostCard';
import ProjectFactory, { ProjectImageFactory } from '../Utility/Functions/Tests/ProjectFactory';
import { smallDesktopLowEndWidth, tabletHighEndWidth, smallTabletHighEndWidth, averageTabletViewWidth } from "../Utility/Constants/Viewports";

describe('render a single PostCard', () => {
  const dumbImgClickFunc = () => 'void';
  //* Main PostCard Func Component
  test("with the proper calculated css classes", () => {
    const testProject = ProjectFactory.create();
    const { rerender } = render(
      <PostCard project={testProject} viewWidth={smallDesktopLowEndWidth}  handleImgClick={dumbImgClickFunc} />
    );
    //? Placing a TestID on a component should be last resort for querying for elements (even if harmless)
    const rootElem = screen.getByTestId('post-card');
    expect(rootElem).not.toHaveClass('foobar');
    expect(rootElem.classList).toHaveLength(2); //* Only base classes
    const rowElem = rootElem.firstChild;
    expect(rowElem).not.toHaveClass('foobar');
    expect(rowElem.classList).toHaveLength(2);//* Only base classes if not set

    rerender(
      <PostCard project={testProject} viewWidth={smallDesktopLowEndWidth} className={'foobar'}
        handleImgClick={dumbImgClickFunc} rowClasses={'foobar'} />
    );
    expect(rootElem).toHaveClass('foobar');
    expect(rowElem).toHaveClass('foobar');
  })

  //* CardImage Func Component
  describe("with a representative image column", () => {
    test("using either a placeholder, img or a carousel", () => {
      //! Placeholder if no imgs in project obj
      const testProject = ProjectFactory.create();
      const { rerender } = render(
        <PostCard project={testProject} viewWidth={smallDesktopLowEndWidth} handleImgClick={dumbImgClickFunc} />
      );
      //* Not an img tag so use getByRole to grab .placeholderImg div's h2 text
      const placeHolderImg = screen.getByRole('heading', { name: /project/i }).parentElement;
      expect(placeHolderImg).toBeInTheDocument();
      
      //! Add an image to the project obj - placeholder disappears, single rep img appears
      testProject.post_images = [ProjectImageFactory.create()];
      rerender(<PostCard project={testProject} viewWidth={smallDesktopLowEndWidth} handleImgClick={dumbImgClickFunc} />)
      expect(placeHolderImg).not.toBeInTheDocument();
      expect(screen.getByRole('img', { name: /barfooalt/i })).toBeInTheDocument();
      //* Still single rep img at desktop (993px) width + multiple images
      testProject.post_images.push(ProjectImageFactory.create()); //* So more than 1 image
      rerender(<PostCard project={testProject} viewWidth={smallDesktopLowEndWidth} handleImgClick={dumbImgClickFunc} />)
      expect(screen.queryByTestId('simple-carousel')).not.toBeInTheDocument();
      expect(screen.getByRole('img', { name: /barfooalt/i })).toBeInTheDocument(); //* Still rep img
      //* Multiple images + 768px tablet (low end for single rep img)
      rerender(<PostCard project={testProject} viewWidth={averageTabletViewWidth} handleImgClick={dumbImgClickFunc} />)
      expect(screen.queryByTestId('simple-carousel')).not.toBeInTheDocument();
      expect(screen.getByRole('img', { name: /barfooalt/i })).toBeInTheDocument(); //* Still rep img
      //? Jest turns css modules into simple to find classes 'PostCardCss.clickable' = 'clickable'
      // expect(screen.getByRole('img', { name: /barfooalt/i })).toHaveClass('clickable');
      //! Carousel appears at 767px tablet (and lower) w/ multiple images
      rerender(<PostCard project={testProject} viewWidth={smallTabletHighEndWidth} handleImgClick={dumbImgClickFunc} />)
      expect(screen.getByTestId('simple-carousel')).toBeInTheDocument();
      expect(screen.getAllByRole('img', { name: /barfooalt/i })).toHaveLength(2) //* Imgs technically still there! but in carousel!
    })
    test("that hints + allows clicks at right viewWidth", async () => {
      const testProject = ProjectFactory.create(); const mockImgClickFunc = jest.fn();
      const user = userEvent.setup();
      const { rerender } = render(
        <PostCard project={testProject} viewWidth={smallTabletHighEndWidth} handleImgClick={mockImgClickFunc} />
      );
      const placeholderImg = screen.getByRole('heading', { name: /project/i }).parentElement;
      expect(placeholderImg).toHaveClass('placeholderImg'); 
      expect(placeholderImg).not.toHaveClass('clickable');
      await user.click(placeholderImg); //* Since in placeholderImg component, no click event or hint at all
      expect(mockImgClickFunc).not.toHaveBeenCalled();

      testProject.post_images = [ProjectImageFactory.create()]; //! Incorrect viewWidth + only single img
      rerender(<PostCard project={testProject} viewWidth={smallTabletHighEndWidth} handleImgClick={mockImgClickFunc} />);
      expect(screen.getByRole('img', { name: /barfooalt/i })).not.toHaveClass('clickable');
      await user.click(screen.getByRole('img', { name: /barfooalt/i }));
      //* Click event fires but no hint to suggest clicking the img (In prod handler must [and does] plan for this)
      expect(mockImgClickFunc).toHaveBeenCalledTimes(1);
      rerender(<PostCard project={testProject} viewWidth={averageTabletViewWidth} handleImgClick={mockImgClickFunc} />);
      expect(screen.getByRole('img', { name: /barfooalt/i })).not.toHaveClass('clickable');
      await user.click(screen.getByRole('img', { name: /barfooalt/i }));
      expect(mockImgClickFunc).toHaveBeenCalledTimes(2);
      //! Correct viewWidth but still only single img
      rerender(<PostCard project={testProject} viewWidth={smallDesktopLowEndWidth} handleImgClick={mockImgClickFunc} />);
      expect(screen.getByRole('img', { name: /barfooalt/i })).not.toHaveClass('clickable');
      await user.click(screen.getByRole('img', { name: /barfooalt/i }));
      expect(mockImgClickFunc).toHaveBeenCalledTimes(3);

      testProject.post_images.push(ProjectImageFactory.create()); //! So more than 1 image BUT incorrect viewWidth
      rerender(<PostCard project={testProject} viewWidth={smallTabletHighEndWidth} handleImgClick={mockImgClickFunc} />);
      const carouselFirstImg = screen.getByRole('img', { name: testProject.post_images[0].alt_text })
      expect(carouselFirstImg).not.toHaveClass('clickable');
      await user.click(carouselFirstImg); //* Since in carousel component, no click event or hint at all
      expect(mockImgClickFunc).toHaveBeenCalledTimes(3); //* # of click events fired remains 3
      rerender(<PostCard project={testProject} viewWidth={averageTabletViewWidth} handleImgClick={mockImgClickFunc} />);
      expect(screen.getByRole('img', { name: /barfooalt/i })).not.toHaveClass('clickable');
      await user.click(screen.getByRole('img', { name: /barfooalt/i }));
      expect(mockImgClickFunc).toHaveBeenCalledTimes(4);
      //! Finally desktop width + multi imgs in obj. Hints at click + fires off click event
      rerender(<PostCard project={testProject} viewWidth={smallDesktopLowEndWidth} handleImgClick={mockImgClickFunc} />);
      expect(screen.getByRole('img', { name: /barfooalt/i })).toHaveClass('clickable');
      await user.click(screen.getByRole('img', { name: /barfooalt/i }));
      expect(mockImgClickFunc).toHaveBeenCalledTimes(5);
    })
  })

  //* CardDetails Func Component
  describe('with a text column', () => {
    test("expecting a title, description + github url & optional homepage url with standard css modules", () => {
      const testProject = ProjectFactory.create();
      const { rerender } = render(
        <PostCard project={testProject} viewWidth={smallDesktopLowEndWidth} handleImgClick={dumbImgClickFunc} />
      );
      const projectTitleHeader = screen.getByRole('heading', { name: /foobar/i });
      expect(projectTitleHeader).toBeInTheDocument();

      const projectDescriptionTag = screen.getByText(/barfoo/i);
      expect(projectDescriptionTag).toBeInTheDocument();
      expect(projectDescriptionTag).toHaveClass('cardText');

      const githubLinkButton = screen.getByRole('button', { name: /github page/i });
      expect(githubLinkButton).toBeInTheDocument();
      expect(githubLinkButton).toHaveClass('githubLink blockButton fw-bold');

      //* Only renders if homepage button if (homepage_url != null && notEmptyString)
      expect(screen.queryByRole('button', { name: /home page/i })).not.toBeInTheDocument();
      testProject.homepage_url = '';
      rerender(<PostCard project={testProject} viewWidth={smallDesktopLowEndWidth} handleImgClick={dumbImgClickFunc} />);
      expect(screen.queryByRole('button', { name: /home page/i })).not.toBeInTheDocument();

      testProject.homepage_url = 'FoobarUrl'; //* Not actually a VALID url BUT maybe one day only real valid urls would pass+render
      rerender(<PostCard project={testProject} viewWidth={smallDesktopLowEndWidth} handleImgClick={dumbImgClickFunc} />);
      const homepageLinkButton = screen.getByRole('button', { name: /home page/i });
      expect(homepageLinkButton).toBeInTheDocument();
      expect(homepageLinkButton).toHaveClass('blockButton fw-bold pageLink');
    })
    test("calculate the right css modules on buttons based on viewWidth", () => {
      const testProject = ProjectFactory.create();
      testProject.homepage_url = 'FoobarUrl';
      const { rerender } = render(
        <PostCard project={testProject} viewWidth={tabletHighEndWidth} handleImgClick={dumbImgClickFunc} />
      );
      const githubLinkButton = screen.getByRole('button', { name: /github page/i });
      expect(githubLinkButton).not.toHaveClass('d-block');
      const homepageLinkButton = screen.getByRole('button', { name: /home page/i }); //* Only renders if a homepage_url exists
      expect(homepageLinkButton).toHaveClass('ms-4');
      
      rerender(<PostCard project={testProject} viewWidth={smallDesktopLowEndWidth} handleImgClick={dumbImgClickFunc} />);
      expect(githubLinkButton).toHaveClass('d-block');
      expect(homepageLinkButton).toHaveClass('d-block mt-4');
    })
  })
})