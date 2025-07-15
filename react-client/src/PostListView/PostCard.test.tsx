import { render, screen } from "@testing-library/react";
import { vi, type MockInstance } from "vitest";
import userEvent from "@testing-library/user-event";
import PostCard from "./PostCard";
import ProjectFactory, { ProjectImageFactory } from "../Utility/TestHelpers/ProjectFactory";
import { smallDesktopLowEndWidth, smallTabletHighEndWidth, averageTabletViewWidth } from "../Utility/Constants/Viewports";
import * as ProjectHelpers from "../Data/Models/Project";
import * as ViewWidthContext from "../ContextProviders/ViewWidthProvider";

describe("render a single PostCard", () => {
  let ViewWidthMock: MockInstance; let ImgSortSpy: MockInstance;
  beforeEach(() => {
    ViewWidthMock = vi.spyOn(ViewWidthContext, "default")
      .mockReturnValue(smallDesktopLowEndWidth);
    ImgSortSpy = vi.spyOn(ProjectHelpers, "SortProjectImagesByImportance");
  });
  afterEach(() => {
    ViewWidthMock.mockRestore();
    ImgSortSpy.mockRestore();
  });

  const dumbImgClickFunc = () => "void";
  //* Main PostCard Func Component
  test("with the proper calculated css classes", () => {
    const testProject = ProjectFactory.create();
    const { rerender } = render(<PostCard project={testProject} onImgClick={dumbImgClickFunc} />);
    //? Placing a TestID on a component should be last resort for querying for elements (even if harmless)
    const rootElem = screen.getByTestId("post-card");
    expect(rootElem).not.toHaveClass("foobar");
    expect(rootElem.classList).toHaveLength(2); //* Only base classes
    const rowElem = rootElem.firstElementChild;
    expect(rowElem).not.toHaveClass("foobar");
    expect(rowElem!.classList).toHaveLength(2); //* Only base classes if not set

    rerender(<PostCard project={testProject} className="foobar" onImgClick={dumbImgClickFunc} rowClasses="foobar" />);
    expect(rootElem).toHaveClass("foobar");
    expect(rowElem).toHaveClass("foobar");
  });

  //! CardImage Func Component
  describe("with a representative image column", () => {
    test("using either a placeholder, img or carousel", async () => {
      //! Placeholder if no imgs in project obj
      const testProject = ProjectFactory.create();
      const { rerender } = render(<PostCard project={testProject} onImgClick={dumbImgClickFunc} />);
      //* Not an img tag so use getByRole to grab .placeholderImg container div's h2 text
      const placeHolderImg = screen.getByRole("heading", { name: /project/i }).parentElement;
      expect(placeHolderImg).toBeInTheDocument(); //* Checking container

      //! Add 1 image to the project obj - placeholder disappears, single rep img appears
      testProject.post_images = [ProjectImageFactory.create()];
      rerender(<PostCard project={testProject} onImgClick={dumbImgClickFunc} />);
      expect(placeHolderImg).not.toBeInTheDocument(); //* Placeholder fades away
      expect(screen.getByRole("img", { name: /barfooalt/i })).toBeInTheDocument(); //* Only one img displayed + no modal open on click
      expect(ImgSortSpy).not.toHaveBeenCalled();

      testProject.post_images = [...testProject.post_images, ProjectImageFactory.create()]; //* Add an img so 2 imgs total
      rerender(<PostCard project={testProject} onImgClick={dumbImgClickFunc} />);
      expect(screen.queryByTestId("app-carousel")).not.toBeInTheDocument(); //* At desktop, never render a carousel as the rep img
      expect(screen.getByRole("img", { name: /barfooalt/i })).toBeInTheDocument(); //* One now clickable rep img displayed
      expect(ImgSortSpy).not.toHaveBeenCalled();

      //! 2 imgs at 768px tablet size. Low end before use a carousel instead of a single clickable modal-opening img
      ViewWidthMock.mockReturnValue(averageTabletViewWidth);
      rerender(<PostCard project={testProject} onImgClick={dumbImgClickFunc} />);
      expect(screen.queryByTestId("app-carousel")).not.toBeInTheDocument(); //* NO carousel still
      expect(screen.getByRole("img", { name: /barfooalt/i })).toBeInTheDocument(); //* Still 1 clickable img
      expect(ImgSortSpy).not.toHaveBeenCalled();

      //! Carousel appears at 767px tablet (and lower) w/ multiple images
      ViewWidthMock.mockReturnValue(smallTabletHighEndWidth);
      rerender(<PostCard project={testProject} onImgClick={dumbImgClickFunc} />);
      expect(await screen.findByTestId("app-carousel")).toBeInTheDocument();
      expect(screen.getAllByRole("img", { name: /barfooalt/i })).toHaveLength(2); //* Imgs technically still there! but in carousel!
      expect(ImgSortSpy).toHaveBeenCalledExactlyOnceWith(testProject.post_images);
    });
    test("that hints + allows clicks at specific viewWidths", async () => {
      const testProject = ProjectFactory.create(); const mockImgClickFunc = vi.fn();
      const user = userEvent.setup();
      //! viewWidth < 767 w/ no imgs so no click event fires, nor CSS hinting that it's clickable
      ViewWidthMock.mockReturnValue(smallTabletHighEndWidth);
      const { rerender } = render(<PostCard project={testProject} onImgClick={mockImgClickFunc} />);
      const placeholderImg = screen.getByRole("heading", { name: /project/i }).parentElement;
      expect(placeholderImg).toHaveClass("placeholderImg"); //? Vitest simplifies CssModules like "PostCardCss.clickable" from
      expect(placeholderImg).not.toHaveClass("clickable"); //? their unique "clickable_ab1cd" to simply "clickable"
      await user.click(placeholderImg!);
      expect(mockImgClickFunc).not.toHaveBeenCalled();

      //! viewWidth still too small to open the modal-carousel, but adding an img replaces the Placeholder with a Card
      testProject.post_images = [ProjectImageFactory.create()];
      rerender(<PostCard project={testProject} onImgClick={mockImgClickFunc} />);
      expect(screen.getByRole("img", { name: /barfooalt/i })).not.toHaveClass("clickable");
      await user.click(screen.getByRole("img", { name: /barfooalt/i })); //* Click event fires but no CSS hint to suggest clicking
      expect(mockImgClickFunc).toHaveBeenCalledTimes(1); //* Prod handles the fired event by returning early
      //! Even at >= 768 viewWidth, the CSS hint is not present
      ViewWidthMock.mockReturnValue(averageTabletViewWidth);
      rerender(<PostCard project={testProject} onImgClick={mockImgClickFunc} />);
      expect(screen.getByRole("img", { name: /barfooalt/i })).not.toHaveClass("clickable");
      await user.click(screen.getByRole("img", { name: /barfooalt/i }));
      expect(mockImgClickFunc).toHaveBeenCalledTimes(2);

      //! Finally at desktop viewWidth but still only single img, so no CSS hint added
      ViewWidthMock.mockReturnValue(smallDesktopLowEndWidth);
      rerender(<PostCard project={testProject} onImgClick={mockImgClickFunc} />);
      expect(screen.getByRole("img", { name: /barfooalt/i })).not.toHaveClass("clickable");
      await user.click(screen.getByRole("img", { name: /barfooalt/i }));
      expect(mockImgClickFunc).toHaveBeenCalledTimes(3);

      //! Now have more than 1 image BUT viewWidth too small
      testProject.post_images = [...testProject.post_images, ProjectImageFactory.create()];
      ViewWidthMock.mockReturnValue(smallTabletHighEndWidth);
      rerender(<PostCard project={testProject} onImgClick={mockImgClickFunc} />);
      const carouselFirstImg = screen.getByRole("img", { name: testProject.post_images[0].alt_text });
      expect(carouselFirstImg).not.toHaveClass("clickable");
      await user.click(carouselFirstImg); //* Since in carousel component, no click event or hint at all
      expect(mockImgClickFunc).toHaveBeenCalledTimes(3); //* # of click events fired remains 3
      //! 768px is still not high enough to add the "clickable" CSS hint
      ViewWidthMock.mockReturnValue(averageTabletViewWidth);
      rerender(<PostCard project={testProject} onImgClick={mockImgClickFunc} />);
      expect(screen.getByRole("img", { name: /barfooalt/i })).not.toHaveClass("clickable");
      await user.click(screen.getByRole("img", { name: /barfooalt/i }));
      expect(mockImgClickFunc).toHaveBeenCalledTimes(4);

      //! Finally desktop width + multi imgs in obj. Hints at click AND also fires off click event
      ViewWidthMock.mockReturnValue(smallDesktopLowEndWidth);
      rerender(<PostCard project={testProject} onImgClick={mockImgClickFunc} />);
      expect(screen.getByRole("img", { name: /barfooalt/i }).parentElement).toHaveClass("clickable");
      await user.click(screen.getByRole("img", { name: /barfooalt/i }));
      expect(mockImgClickFunc).toHaveBeenCalledTimes(5);
    });
  });

  //! CardDetails Func Component
  describe("with a text column", () => {
    test("expecting a title, description + github url & optional homepage url with standard css modules", () => {
      const testProject = ProjectFactory.create();
      const { rerender } = render(<PostCard project={testProject} onImgClick={dumbImgClickFunc} />);
      const projectTitleHeader = screen.getByRole("heading", { name: /foobar/i });
      expect(projectTitleHeader).toBeInTheDocument();

      const projectDescriptionTag = screen.getByText(/barfoo/i);
      expect(projectDescriptionTag).toBeInTheDocument();
      expect(projectDescriptionTag).toHaveClass("cardText");

      const githubLinkButton = screen.getByRole("button", { name: /github page/i });
      expect(githubLinkButton).toBeInTheDocument();
      expect(githubLinkButton).toHaveClass("githubLink blockButton fw-bold");

      //* Only renders if homepage button if (homepage_url != null && notEmptyString)
      expect(screen.queryByRole("button", { name: /home page/i })).not.toBeInTheDocument();
      testProject.homepage_url = "";
      rerender(<PostCard project={testProject} onImgClick={dumbImgClickFunc} />);
      expect(screen.queryByRole("button", { name: /home page/i })).not.toBeInTheDocument();

      testProject.homepage_url = "FoobarUrl"; //* Not actually a VALID url BUT maybe one day only real valid urls would pass+render
      rerender(<PostCard project={testProject} onImgClick={dumbImgClickFunc} />);
      const homepageLinkButton = screen.getByRole("button", { name: /home page/i });
      expect(homepageLinkButton).toBeInTheDocument();
      expect(homepageLinkButton).toHaveClass("blockButton fw-bold pageLink");
    });
  });
});
