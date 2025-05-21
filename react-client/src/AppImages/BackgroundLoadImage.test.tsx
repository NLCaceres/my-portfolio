import React from "react";
import { vi } from "vitest";
import { fireEvent, render, screen, waitForElementToBeRemoved, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Globals } from "@react-spring/web";
import BackgroundLoadImage from "./BackgroundLoadImage";

beforeAll(() => { //? Run React-Spring animations BUT limit waitFor's waiting time so tests run
  Globals.assign({ skipAnimation: true }); //? quickly BUT aren't flaking due to animation timing
});

describe("renders an image with option to display a placeholder while loading", () => {
  test("requiring a src and alt to be passed in", () => {
    const { rerender } = render(<BackgroundLoadImage src="foobar" alt="barfoo" />);
    //? MUST pass in alt prop, else Testing-Lib assigns a "presentation" role to img tags
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "foobar");
    expect(img).toHaveAttribute("alt", "barfoo");

    rerender(<BackgroundLoadImage src="fizz" alt="buzz" />);
    const imgTwo = screen.getByRole("img");
    expect(imgTwo).toHaveAttribute("src", "fizz");
    expect(imgTwo).toHaveAttribute("alt", "buzz");
  });
  test("allowing the placeholder's text to be inserted, updated, and styled", () => {
    const { rerender } = render(<BackgroundLoadImage src="" alt="" placeholderText="Hello World!" placeholderTextStyle={{ opacity: 0 }} />);
    const heading = screen.getByText("Hello World!");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveStyle({ opacity: 0 });

    //* React TS types might have a better type than ReactNode to help prevent passing in
    const someDiv = <div>Foobar</div>; // components to the placeholderText prop
    rerender(<BackgroundLoadImage src="" alt="" placeholderText={someDiv} />);
    const nonHeaderPlaceholderText = screen.getByText("Foobar");
    expect(nonHeaderPlaceholderText).toBeInTheDocument();
    expect(nonHeaderPlaceholderText).not.toHaveAttribute("style");
  });
  test("allowing an onclick callback to be put on the true img tag", async () => {
    const clickCallback = vi.fn();
    const { rerender } = render(<BackgroundLoadImage src="" alt="Some Img" onImgClick={clickCallback} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("img")); //* Callback called one time
    expect(clickCallback).toHaveBeenCalledTimes(1);

    rerender(<BackgroundLoadImage src="" alt="Some Img" />); //* Remove callback
    await user.click(screen.getByRole("img"));
    expect(clickCallback).toHaveBeenCalledTimes(1); //* So mock still only has been called 1 time
  });
  describe("using load state", () => {
    test("to cover the image", async () => {
      const { unmount } = render(<BackgroundLoadImage src="" alt="Real img" />);
      const img = screen.getByRole("img"); //* Img in the doc
      expect(img.previousElementSibling).toBeInTheDocument(); //* Placeholder exists in the doc
      fireEvent.load(img); //* FORCE image to "successfully" load
      expect(img).toBeInTheDocument(); //* Img remains in doc
      await waitForElementToBeRemoved(img.previousElementSibling); //* Placeholder div gone

      unmount();

      render(<BackgroundLoadImage src="" alt="Img will fail to load" />);
      const failImg = screen.getByRole("img"); //* This img will fail to load
      const placeholder = screen.getByRole("heading", { level: 2 }); //* Grab placeholder heading
      expect(placeholder.parentElement).toBeInTheDocument(); //* Parent = placeholder container
      fireEvent.error(failImg); //* Image fails to load
      expect(failImg).not.toBeInTheDocument(); //* Image now will disappear due to failed loading
      expect(placeholder).toBeInTheDocument(); //* Placeholder gets to stay
    });
    test("to fire a parent callback regardless of success or failure", async () => {
      const loadCallback = vi.fn();
      const { rerender, unmount } = render(<BackgroundLoadImage src="" alt="Img will load correctly" onLoad={loadCallback} />);
      const img = screen.getByRole("img"); //* Img begins loading in background
      fireEvent.load(img); //* FORCE image to "successfully" load
      expect(loadCallback).toBeCalledTimes(1); //* Succeeded, check if callback added and call it

      rerender(<BackgroundLoadImage src="" alt="Img will load correctly" />);
      expect(img).toBeInTheDocument(); //* Image still there
      fireEvent.load(img); //* Image successfully loaded again but no callback passed in
      expect(loadCallback).toBeCalledTimes(1); //* No callback so nothing to run on load success
      unmount();

      //* Re-add the callback
      render(<BackgroundLoadImage src="" alt="Img will load correctly" onLoad={loadCallback}/>);
      const failImg = screen.getByRole("img"); //* Image will fail to load correctly
      fireEvent.error(failImg); //* Image fails to load
      expect(loadCallback).toBeCalledTimes(2); //* Still call parent's callback!
    });
    test("that resets if the image src changes", async () => {
      const { rerender } = render(<BackgroundLoadImage src="foobar.jpeg" alt="Img will load" />);
      const img = screen.getByRole("img"); //* Img begins loading in background
      expect(img.previousElementSibling).toBeInTheDocument(); //* Placeholder exists in the doc
      fireEvent.load(img); //* FORCE image to successfully load
      expect(img).toBeInTheDocument(); //* Img remains in doc
      await waitForElementToBeRemoved(img.previousElementSibling); //* Placeholder div gone

      rerender(<BackgroundLoadImage src="barfoo.jpeg" alt="Img will load" />);
      const newImg = screen.getByRole("img"); //* Img starts to reload with new src
      expect(newImg.previousElementSibling).toBeInTheDocument(); //* Placeholder in doc again
      fireEvent.load(newImg);
      expect(newImg).toBeInTheDocument(); //* Img remains in doc
      await waitForElementToBeRemoved(newImg.previousElementSibling); //* Placeholder div gone
    });
  });
  test("with custom css options for each of its 3 tags", () => {
    const { rerender } = render(<BackgroundLoadImage src="" alt="Img will load" />);
    const img = screen.getByRole("img");
    expect(img).toHaveClass("photo", { exact: true });

    expect(img.parentElement).toHaveClass("container ", { exact: true });
    //* Unclear if useResize is adjusting height/width at all
    img.parentElement!.setAttribute("style", "height: 250px; width: 250px;");
    //* BUT the style does get match expected updated output
    expect(img.parentElement).toHaveStyle({ height: "250px", width: "250px" });

    expect(img.previousElementSibling).toHaveClass("placeholderImg placeholder", { exact: true });

    rerender(<BackgroundLoadImage src="" alt="" className="foo" placeholderClass="bar" imgClass="fizz" />);
    expect(img.parentElement).toHaveClass("container foo", { exact: true });
    expect(img.previousElementSibling).toHaveClass("placeholderImg placeholder bar", { exact: true });
    expect(img).toHaveClass("photo fizz", { exact: true });
  });
  test("enabling ref forwarding via 'parentRef' prop", async () => {
    const parentRef = React.createRef<HTMLDivElement>();
    const { rerender } = render(<BackgroundLoadImage src="" alt="" parentRef={parentRef} />);
    //* parentRef adds the containing div as its 'current' prop
    await waitFor(() => expect(parentRef.current).toHaveClass("container"));

    rerender(<BackgroundLoadImage src="" alt="" />);
    expect(parentRef.current).toBe(null); //* Dropping parentRef prop sets `current` to null
  });
});
