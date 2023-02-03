import React from 'react';
import { render, screen, act, waitFor, prettyDOM } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import SimpleCarousel from "./SimpleCarousel";
import { ProjectImageFactory } from '../Utility/Functions/Tests/ProjectFactory';
import { averageTabletViewWidth, miniMobileHighEndWidth, mobileHighEndWidth, smallDesktopViewWidth, smallTabletHighEndWidth } from "../Utility/Constants/Viewports";

describe('render a simple react-bootstrap carousel', () => {
  const imageSet = [ProjectImageFactory.create(), ProjectImageFactory.create()];
  describe("that has indicators", () => {
    test("that flash on tablets and wider screens via set/clearInterval", () => {
      jest.useFakeTimers(); //? Setup to test to setInterval (or setTimeout if it was used)
      const setIntervalSpy = jest.spyOn(window, 'setInterval');
      const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
      const { unmount } = render(<SimpleCarousel images={imageSet} viewWidth={averageTabletViewWidth} />)
      expect(setIntervalSpy).toHaveBeenCalledTimes(1); 
      expect(clearIntervalSpy).not.toHaveBeenCalled();

      const carouselRootElem = screen.getByTestId('simple-carousel');
      expect(carouselRootElem).not.toHaveClass('hovered-indicators'); //* Starts invisible
      for (let i = 0; i < 6; i++) { //* 3 flashes of the indicators, on, off, on...
        act(() => { jest.advanceTimersByTime(750) }); //? act() needed since React components using hooks get called as timers advance
        (i % 2 === 0) ? expect(carouselRootElem).toHaveClass('hovered-indicators') : expect(carouselRootElem).not.toHaveClass('hovered-indicators');
      }
      expect(clearIntervalSpy).toHaveBeenCalledTimes(1); //* clearInterval called as hover hint animation finishes
      unmount();
      expect(clearIntervalSpy).toHaveBeenCalledTimes(2); //* Called on unmount when bigger than mobile size
      jest.useRealTimers(); //? Cleanup/Reset - Not too early or the interval spies get unmocked & undefined
      
      jest.useFakeTimers();
      const { unmount: secondUnmount } = render(<SimpleCarousel images={imageSet} viewWidth={smallTabletHighEndWidth} />);
      expect(setIntervalSpy).toHaveBeenCalledTimes(1); //* Spies not called at mobile size
      expect(carouselRootElem).not.toHaveClass('hovered-indicators'); //* No flashes now or with timer advances
      for (let i = 0; i < 6; i++) { 
        act(() => { jest.advanceTimersByTime(750) }); 
        expect(carouselRootElem).not.toHaveClass('hovered-indicators');
      }
      secondUnmount();
      expect(clearIntervalSpy).toHaveBeenCalledTimes(2); //* Spies not called at mobile size so remain at 2 total times called
      jest.useRealTimers(); setIntervalSpy.mockRestore(); clearIntervalSpy.mockRestore(); //* Cleanup
    })
    test("that handles index changes via indicator buttons", async () => {
      render(<SimpleCarousel images={imageSet} viewWidth={averageTabletViewWidth} />)
      const user = userEvent.setup();
      const activeImgIndicators = screen.getAllByRole('button');
      const currentImages = screen.getAllByAltText(/BarfooAlt/i).sort();
      //* currentImages[0].alt should be BarfooAlt1 or simply smallest numbered altText value
      //* currentImages[1].alt should be BarfooAlt2
      expect(currentImages[0].parentElement.className).toBe("active carousel-item"); //* 1st is always active to start
      expect(currentImages[1].parentElement.className).toBe("carousel-item"); //* Always starts deactivated

      await user.click(activeImgIndicators[1]);
      await waitFor(() => { expect(currentImages[0].parentElement.className).toBe("carousel-item") }); //* Deactivated
      //* Img #2 is activated next BUT using waitFor() className since CSS transition classes are applied first
      await waitFor(() => { expect(currentImages[1].parentElement.className).toBe("active carousel-item") });
      
      await user.click(activeImgIndicators[0]);
      await waitFor(() => { expect(currentImages[0].parentElement.className).toBe("active carousel-item") }); //* Reactivated
      await waitFor(() => { expect(currentImages[1].parentElement.className).toBe("carousel-item") }); //* Deactivated again
    })
    /* 
    test("that displays on hover", async () => {
      const { rerender } = render(<SimpleCarousel images={imageSet} viewWidth={averageTabletViewWidth} />)
      const carouselRootElem = screen.getByTestId('simple-carousel')
      const carouselIndicators = carouselRootElem.firstChild
      ? It would seem the next line would work! BUT jest-dom doesn't really load stylesheets! 
      ? SO testing media-queries becomes more of a Cypress (e2e) task!
      expect(carouselIndicators).toHaveStyle('visibility: hidden')
    }) */
  })
  test("calculating the right css classes for its root + aspect ratio for imgs", () => {
    const { rerender } = render(<SimpleCarousel images={imageSet} viewWidth={smallDesktopViewWidth} />)
    const carouselRoot = screen.getByTestId('simple-carousel');
    expect(carouselRoot).toHaveClass('full carousel slide', { exact: true });

    const carouselImageTags = screen.getAllByRole('img');
    expect(carouselImageTags).toHaveLength(2); //* Following is height/width aspect ratio check across 5 viewports, starting with 450/350 > 992px width
    for (let imageTag of carouselImageTags) { expect(imageTag).toHaveAttribute('height', '450'); expect(imageTag).toHaveAttribute('width', '350') }
    rerender(<SimpleCarousel images={imageSet} viewWidth={averageTabletViewWidth} className="foobar" />); //* 500/350 at 991-768px width
    for (let imageTag of carouselImageTags) { expect(imageTag).toHaveAttribute('height', '500'); expect(imageTag).toHaveAttribute('width', '350') }

    rerender(<SimpleCarousel images={imageSet} viewWidth={smallTabletHighEndWidth} className="foobar" />); //* 550/425 at 767-576px width
    expect(carouselRoot).toHaveClass('full carousel slide foobar', { exact: true });
    for (let imageTag of carouselImageTags) { expect(imageTag).toHaveAttribute('height', '550'); expect(imageTag).toHaveAttribute('width', '425') }

    rerender(<SimpleCarousel images={imageSet} viewWidth={mobileHighEndWidth} className="foobar" />); //* 450/330 at 575-360px width
    for (let imageTag of carouselImageTags) { expect(imageTag).toHaveAttribute('height', '450'); expect(imageTag).toHaveAttribute('width', '330') }
    rerender(<SimpleCarousel images={imageSet} viewWidth={miniMobileHighEndWidth} className="foobar" />); //* 450/280 < 360px width
    for (let imageTag of carouselImageTags) { expect(imageTag).toHaveAttribute('height', '450'); expect(imageTag).toHaveAttribute('width', '280') }
  })
  test("display captions if the property is available", () => {
    const { rerender } = render(<SimpleCarousel images={imageSet} viewWidth={averageTabletViewWidth} />)
    expect(screen.queryAllByText(/^(Foo)\w+$/i)).toHaveLength(0);
    
    //* Create img objects to display
    const imagesWithCaptions = imageSet.map((image, index) => ({ ...image, caption: 'Foo'+index }));
    rerender(<SimpleCarousel images={imagesWithCaptions} viewWidth={averageTabletViewWidth} />)
    const captionHeaderTags = screen.getAllByRole("heading", { name: /foo/i });
    expect(captionHeaderTags).toHaveLength(2);
  })
})