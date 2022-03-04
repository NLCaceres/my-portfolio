import React from 'react';
import { render, screen, prettyDOM } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import SimpleCarousel from "./SimpleCarousel";
import { ProjectImageFactory } from '../Utility/Functions/Tests/ProjectFactory';
import { averageTabletViewWidth, smallTabletHighEndWidth } from "../Utility/Constants/Viewports";

const ImitateHoverHint = (carousel, alternating = false) => {
  expect(carousel).not.toHaveClass('hovered-indicators');
  //? Ordinarily would need act() to force state changes caused by jest's advanceTimers func BUT
  //? Seemingly thanks to ReactTestingLibrary's version of render(), all good! No act() wrapper needed!
  for (let i = 0; i <= 5; i++) {
    jest.advanceTimersByTime(750);
    if (alternating && i % 2 === 0) expect(carousel).toHaveClass('hovered-indicators');
    else expect(carousel).not.toHaveClass('hovered-indicators');
  }
}

describe('render a simple react-bootstrap carousel', () => {
  let imageSet;
  beforeEach(() => {
    imageSet = [ProjectImageFactory.create(), ProjectImageFactory.create()];
  })
  describe("that has indicators", () => {
    test("that flash on tablets and wider screens via set/clearInterval", () => {
      jest.useFakeTimers(); //? Setup to test to setInterval (or setTimeout if it was used)
      const setIntervalSpy = jest.spyOn(window, 'setInterval');
      const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
      const { unmount } = render(<SimpleCarousel images={imageSet} viewWidth={averageTabletViewWidth} />)
      const carouselRootElem = screen.getByTestId('simple-carousel');
      ImitateHoverHint(carouselRootElem, true); //* Quick flashes + hover effect also possible
      expect(setIntervalSpy).toHaveBeenCalledTimes(1);
      jest.useRealTimers(); //? Cleanup/Reset
      unmount();
      expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
      
      jest.useFakeTimers();
      const { unmount: secondUnmount } = render(<SimpleCarousel images={imageSet} viewWidth={smallTabletHighEndWidth} />);
      expect(setIntervalSpy).toHaveBeenCalledTimes(1); //* Spies not called at mobile size
      expect(carouselRootElem).not.toHaveClass('hovered-indicators');
      ImitateHoverHint(carouselRootElem); //* Regardless of time, indicators always shown + no hover effect
      jest.useRealTimers();
      secondUnmount();
      expect(clearIntervalSpy).toHaveBeenCalledTimes(1); //* Spies not called at mobile size
      setIntervalSpy.mockRestore();
      clearIntervalSpy.mockRestore();
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
  //todo Test out jest spies by swapping out interval callback? just MAYBE
  test("displaying the right css modules for its image tags", () => {
    const { rerender } = render(<SimpleCarousel images={imageSet} viewWidth={averageTabletViewWidth} />)
    const carouselImageTags = screen.getAllByRole('img');
    expect(carouselImageTags).toHaveLength(2);
    for (let imageTag of carouselImageTags) {
      expect(imageTag).toHaveClass('img-fluid slide');
    }

    rerender(<SimpleCarousel images={imageSet} viewWidth={smallTabletHighEndWidth} />);
    expect(carouselImageTags).toHaveLength(2);
    for (let imageTag of carouselImageTags) {
      expect(imageTag).toHaveClass('img-fluid mobileSlide');
    }
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