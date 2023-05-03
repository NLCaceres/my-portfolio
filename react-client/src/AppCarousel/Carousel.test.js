import React from 'react';
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AppCarousel from "./AppCarousel";
import { ProjectImageFactory } from "../Utility/TestHelpers/ProjectFactory";
import { averageTabletViewWidth, miniMobileHighEndWidth, mobileHighEndWidth, smallDesktopViewWidth, smallTabletHighEndWidth } from "../Utility/Constants/Viewports";
import * as ViewWidthContext from "../ContextProviders/ViewWidthProvider";

describe("render a simple react-bootstrap carousel", () => {
  const imageSet = [ProjectImageFactory.create(), ProjectImageFactory.create()];
  test("with the option to render an entirely different inner-carousel div via 'children' prop", () => {
    const { rerender } = render(<AppCarousel><div>Hello World</div></AppCarousel>);
    const child = screen.getByText(/hello world/i);
    expect(child).toBeInTheDocument();
    const innerParent = child.parentElement;
    expect(innerParent).toHaveClass("carousel-inner", { exact: true });
    expect(innerParent.previousElementSibling).toHaveClass("carousel-indicators", { exact: true });

    rerender(<AppCarousel />);
    expect(innerParent).toBeInTheDocument(); //* Remains in the doc but
    expect(innerParent).toBeEmptyDOMElement(); //* It is now empty
    expect(innerParent.previousElementSibling).toBeInTheDocument(); //* Indicators still present as well!

    rerender(<AppCarousel images={imageSet} />);
    expect(innerParent).not.toBeEmptyDOMElement(); //* Now rendering img tags in default carousel items
    expect(screen.getAllByRole("img")).toHaveLength(2); //* If img array passed in, will render corresponding # of img tags
  })
  describe("that has indicators", () => {
    test("that flash on tablets and wider screens via set/clearInterval", () => {
      jest.useFakeTimers(); //? Setup to test to setInterval (or setTimeout if it was used)
      const setIntervalSpy = jest.spyOn(window, "setInterval");
      const clearIntervalSpy = jest.spyOn(window, "clearInterval");
      const useViewWidthSpy = jest.spyOn(ViewWidthContext, "default").mockReturnValue(averageTabletViewWidth);
      const { unmount } = render(<AppCarousel images={imageSet} />);
      expect(setIntervalSpy).toHaveBeenCalledTimes(1); 
      expect(clearIntervalSpy).not.toHaveBeenCalled();

      const carouselRootElem = screen.getByTestId("app-carousel");
      expect(carouselRootElem).not.toHaveClass("hovered-indicators"); //* Starts invisible
      for (let i = 0; i < 6; i++) { //* 3 flashes of the indicators, on, off, on...
        act(() => { jest.advanceTimersByTime(750) }); //? act() needed since React components using hooks get called as timers advance
        (i % 2 === 0) ? expect(carouselRootElem).toHaveClass("hovered-indicators") : expect(carouselRootElem).not.toHaveClass("hovered-indicators");
      }
      expect(clearIntervalSpy).toHaveBeenCalledTimes(1); //* clearInterval called as hover hint animation finishes
      unmount();
      expect(clearIntervalSpy).toHaveBeenCalledTimes(2); //* Called on unmount when bigger than mobile size
      jest.useRealTimers(); //? Cleanup/Reset - Not too early or the interval spies get unmocked & undefined
      
      jest.useFakeTimers();
      useViewWidthSpy.mockReturnValue(smallTabletHighEndWidth);
      const { unmount: secondUnmount } = render(<AppCarousel images={imageSet} />);
      expect(setIntervalSpy).toHaveBeenCalledTimes(1); //* Spies not called at mobile size
      expect(carouselRootElem).not.toHaveClass("hovered-indicators"); //* No flashes now or with timer advances
      for (let i = 0; i < 6; i++) { 
        act(() => { jest.advanceTimersByTime(750) }); 
        expect(carouselRootElem).not.toHaveClass("hovered-indicators");
      }
      secondUnmount();
      expect(clearIntervalSpy).toHaveBeenCalledTimes(2); //* Spies not called at mobile size so remain at 2 total times called
      jest.useRealTimers(); 
      setIntervalSpy.mockRestore(); clearIntervalSpy.mockRestore(); useViewWidthSpy.mockRestore(); //* Cleanup
    })
    test("that handles index changes via indicator buttons", async () => {
      render(<AppCarousel images={imageSet} />);
      const user = userEvent.setup();
      const activeImgIndicators = screen.getAllByRole("button");
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
      const { rerender } = render(<AppCarousel images={imageSet} />)
      const carouselRootElem = screen.getByTestId('app-carousel')
      const carouselIndicators = carouselRootElem.firstChild
      ? It would seem the next line would work! BUT jest-dom doesn't really load stylesheets! 
      ? SO testing media-queries becomes more of a Cypress (e2e) task!
      expect(carouselIndicators).toHaveStyle('visibility: hidden')
    }) */
  })
  describe("with an option to swap out the default item", () => {
    test("if a render function is passed into the ItemComponent prop", () => {
      const { rerender } = render(<AppCarousel images={imageSet} />);
      const defaultImgTags = screen.getAllByRole("img");
      //* The following specific classList signifies the default item has rendered
      for (const imageTag of defaultImgTags) { expect(imageTag).toHaveClass("img-fluid slide", { exact: true }) }

      const itemComponent = ({src, alt}) => (<><div>{src}</div><div>{alt}</div></>);
      rerender(<AppCarousel images={imageSet} ItemComponent={itemComponent} />);
      const srcDivs = screen.getAllByText(/foobarsrc/i); //* Should still be two! Same # as the images array
      expect(srcDivs).toHaveLength(2); //* BUT no longer able to pass in classes
      for (const srcDiv of srcDivs) { expect(srcDiv).not.toHaveAttribute("class") }
      const altDivs = screen.getAllByText(/barfooalt/i);
      expect(altDivs).toHaveLength(2);
      for (const altDiv of altDivs) { expect(altDiv).not.toHaveAttribute("class") }

      rerender(<AppCarousel images={[]} ItemComponent={itemComponent} />);
      const carousel = screen.getByTestId("app-carousel");
      const itemContainer = carousel.lastElementChild; //* No images to inject srcs or alt_texts into so nothing renders!
      expect(itemContainer).toBeEmptyDOMElement(); //* Div container where items go is now empty
    })
  })
  describe("with a default item component", () => {
    test("calculating the right css classes for its root + aspect ratio for default Item img tags", () => {
      const useViewWidthSpy = jest.spyOn(ViewWidthContext, "default").mockReturnValue(smallDesktopViewWidth);
      const { rerender } = render(<AppCarousel images={imageSet} />);
      const carouselRoot = screen.getByTestId("app-carousel");
      expect(carouselRoot).toHaveClass("full carousel slide", { exact: true });
  
      const carouselImageTags = screen.getAllByRole("img");
      expect(carouselImageTags).toHaveLength(2); //* Following is height/width aspect ratio check across 5 viewports, starting with 450/350 > 992px width
      for (let imageTag of carouselImageTags) { expect(imageTag).toHaveAttribute("height", "450"); expect(imageTag).toHaveAttribute("width", "350") }
      
      useViewWidthSpy.mockReturnValue(averageTabletViewWidth);
      rerender(<AppCarousel images={imageSet} className="foobar" />); //* 500/350 at 991-768px width
      for (let imageTag of carouselImageTags) { expect(imageTag).toHaveAttribute("height", "500"); expect(imageTag).toHaveAttribute("width", "350") }
  
      useViewWidthSpy.mockReturnValue(smallTabletHighEndWidth);
      rerender(<AppCarousel images={imageSet} className="foobar" />); //* 550/425 at 767-576px width
      expect(carouselRoot).toHaveClass("full carousel slide foobar", { exact: true });
      for (let imageTag of carouselImageTags) { expect(imageTag).toHaveAttribute("height", "550"); expect(imageTag).toHaveAttribute("width", "425") }
  
      useViewWidthSpy.mockReturnValue(mobileHighEndWidth);
      rerender(<AppCarousel images={imageSet} className="foobar" />); //* 450/330 at 575-360px width
      for (let imageTag of carouselImageTags) { expect(imageTag).toHaveAttribute("height", "450"); expect(imageTag).toHaveAttribute("width", "330") }
      
      useViewWidthSpy.mockReturnValue(miniMobileHighEndWidth);
      rerender(<AppCarousel images={imageSet} className="foobar" />); //* 450/280 < 360px width
      for (let imageTag of carouselImageTags) { expect(imageTag).toHaveAttribute("height", "450"); expect(imageTag).toHaveAttribute("width", "280") }

      useViewWidthSpy.mockRestore();
    })
    test("display captions if the property is available", () => {
      const useViewWidthSpy = jest.spyOn(ViewWidthContext, "default").mockReturnValue(averageTabletViewWidth);
      const { rerender } = render(<AppCarousel images={imageSet} />);
      expect(screen.queryAllByText(/^(Foo)\w+$/i)).toHaveLength(0);
      
      //* Create img objects to display
      const imagesWithCaptions = imageSet.map((image, index) => ({ ...image, caption: "Foo" + index }));
      rerender(<AppCarousel images={imagesWithCaptions} />);
      const captionHeaderTags = screen.getAllByRole("heading", { name: /foo/i });
      expect(captionHeaderTags).toHaveLength(2);

      useViewWidthSpy.mockRestore();
    })
  })
})