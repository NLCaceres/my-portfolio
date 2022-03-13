import React from 'react';
import { render, screen, prettyDOM } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import SimpleCarousel from "./SimpleCarousel";
import { ProjectImageFactory } from '../Utility/Functions/Tests/ProjectFactory';
import { averageTabletViewWidth, smallTabletHighEndWidth } from "../Utility/Constants/Viewports";

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
        jest.advanceTimersByTime(750); //? ReactTestLib uses act() inside render() so rerenders from advanceTimers() work as expected!
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
      for (let i = 0; i < 6; i++) { jest.advanceTimersByTime(750); expect(carouselRootElem).not.toHaveClass('hovered-indicators'); }
      secondUnmount();
      expect(clearIntervalSpy).toHaveBeenCalledTimes(2); //* Spies not called at mobile size so remain at 2 total times called
      jest.useRealTimers(); setIntervalSpy.mockRestore(); clearIntervalSpy.mockRestore(); //* Cleanup
    })
    test("that handles index changes via indicator buttons", async () => {
      const setStateMock = jest.spyOn(SimpleCarousel.prototype, 'setState');
      render(<SimpleCarousel images={imageSet} viewWidth={averageTabletViewWidth} />)
      const user = userEvent.setup();
      const activeImgIndicators = screen.getAllByRole('button');
      await user.click(activeImgIndicators[1]);
      await user.click(activeImgIndicators[0]);
      expect(setStateMock).toHaveBeenCalledTimes(2);
      setStateMock.mockRestore();
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
  //todo MAYBE Test out jest spies by swapping out interval callback?
  test("displaying the right css classes for its root & image tags", () => {
    const { rerender } = render(<SimpleCarousel images={imageSet} viewWidth={averageTabletViewWidth} />)
    const carouselRoot = screen.getByTestId('simple-carousel');
    expect(carouselRoot).toHaveClass('full carousel slide', { exact: true });
    const carouselImageTags = screen.getAllByRole('img');
    expect(carouselImageTags).toHaveLength(2);
    for (let imageTag of carouselImageTags) expect(imageTag).toHaveClass('img-fluid slide');

    rerender(<SimpleCarousel images={imageSet} viewWidth={smallTabletHighEndWidth} className="foobar" />);
    expect(carouselRoot).toHaveClass('full carousel slide foobar', { exact: true });
    expect(carouselImageTags).toHaveLength(2);
    for (let imageTag of carouselImageTags) expect(imageTag).toHaveClass('img-fluid mobileSlide');
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