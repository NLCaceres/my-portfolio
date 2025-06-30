import { fireEvent, render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import { Globals } from "@react-spring/web";
import NotFoundPage from "./NotFoundPage";

beforeAll(() => {
  //? Skips the interpolation of values in React-Spring animations BUT runs all expected animations still!
  Globals.assign({ skipAnimation: true }); //? So tests run quick BUT props are updated as expected!
});

describe("renders a basic but fun 'Not Found' Page", () => {
  test("using a placeholder to cover the loading image before unveiling", async () => {
    render(<NotFoundPage />);
    const placeholder = screen.getByRole("heading", { name: /puppy incoming/i }).parentElement;
    expect(placeholder).toBeInTheDocument();
    fireEvent.load(screen.getByRole("img"));
    await waitForElementToBeRemoved(placeholder);
  });
  test("with simple css modules for each element", () => {
    render(<NotFoundPage />);
    const titleTag = screen.getByText(/sorry/i);

    const containerTag = titleTag.parentElement;
    expect(containerTag).toHaveClass("container");

    const placeholder = screen.getByRole("heading", { name: /puppy incoming/i }).parentElement;
    expect(placeholder).toHaveClass("placeholderImg image");

    const backgroundLoadingImageContainer = placeholder!.parentElement;
    expect(backgroundLoadingImageContainer).toHaveClass("container backgroundContainer", { exact: true });

    const pupImage = screen.getByRole("img");
    expect(pupImage).toHaveClass("image");

    const descriptionTag = screen.getByRole("heading", { name: /so here's a puppy to make up for it/i });
    expect(descriptionTag).toHaveClass("caption");
  });
  test("keeping its img across basic rerenders", () => {
    const { rerender } = render(<NotFoundPage />);
    const puppyImgTag = screen.getByRole("img", { name: /a cute pup/i });
    expect(puppyImgTag).toHaveClass("image");
    const oldPuppyImgSrc = (puppyImgTag as HTMLImageElement).src;
    rerender(<NotFoundPage />); //* If same url (no navigation), a rerender won't change the img
    expect((puppyImgTag as HTMLImageElement).src).toMatch(oldPuppyImgSrc);
    //* Could expect() a new img via unmount or a new render BUT
    //* 1 in 10 odds the same img appears anyway so no real certainty the test passes
    //* So by rendering 3 more NotFoundPage components, the odds (now 1 in 10,000) decrease that all 4 images use the same src
    render(<NotFoundPage />);
    render(<NotFoundPage />);
    render(<NotFoundPage />);
    //* Once rendered, grab all the images, and check if one src is different than the other
    const imgTags = screen.getAllByRole("img", { name: /a cute pup/i });
    let foundDifferentImages = false; //* Flip this bool if the previous img src is different than current one
    for (let i = 0; i < imgTags.length; i++) {
      if (i > 0 && imgTags[i] !== imgTags[i-1]) { foundDifferentImages = true; }
    }
    expect(foundDifferentImages).toBe(true); //* VERY unlikely the test found same image 4 times, so one must be different than the others
  });
});
