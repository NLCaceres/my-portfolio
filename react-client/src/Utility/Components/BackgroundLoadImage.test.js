import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import BackgroundLoadImage from "./BackgroundLoadImage";

describe("renders an image with option to display a placeholder while loading", () => {
  test("requiring a src and alt to be passed in", () => {
    const { rerender } = render(<BackgroundLoadImage src="foobar" alt="barfoo" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "foobar");
    expect(img).toHaveAttribute("alt", "barfoo");

    rerender(<BackgroundLoadImage src="fizz" alt="buzz" />);
    const imgTwo = screen.getByRole("img");
    expect(imgTwo).toHaveAttribute("src", "fizz");
    expect(imgTwo).toHaveAttribute("alt", "buzz");

    rerender(<BackgroundLoadImage />);
    const finalImg = screen.getByRole("img");
    expect(finalImg).not.toHaveAttribute("src");
    expect(finalImg).not.toHaveAttribute("alt");
  })
  test("covering the image based on its load state, uncovering when successfully loaded or remaining if it fails, both firing a callback", () => {
    const loadCallback = jest.fn();
    const { rerender, unmount } = render(<BackgroundLoadImage onLoad={loadCallback} />);
    const img = screen.getByRole("img");
    expect(img.previousElementSibling).toBeInTheDocument(); //* Should be placeholder;
    fireEvent.load(img); //* Image successfully loaded
    expect(img).toBeInTheDocument(); //* Img remains in doc
    expect(img.previousElementSibling).not.toBeInTheDocument(); //* Placeholder div disappears
    expect(loadCallback).toBeCalledTimes(1); //* It succeeded, check if callback added and call it!
    
    rerender(<BackgroundLoadImage />);
    expect(img).toBeInTheDocument();
    fireEvent.load(img); //* Image successfully loaded but no callback passed in
    expect(img.previousElementSibling).not.toBeInTheDocument();
    expect(loadCallback).toBeCalledTimes(1); //* Not used, so the check fails and it's not called
    unmount();

    render(<BackgroundLoadImage onLoad={loadCallback}/>);
    const failImg = screen.getByRole("img");
    const placeholder = screen.getByRole('heading', { level: 2 });
    expect(placeholder.parentElement).toBeInTheDocument();
    fireEvent.error(failImg); //* Image fails to load
    expect(failImg).not.toBeInTheDocument(); //* Make image disappear!
    expect(placeholder).toBeInTheDocument(); //* Let placeholder remain
    expect(loadCallback).toBeCalledTimes(2); //* Still call parent's callback!
  })
  test("with custom css options for each of its 3 tags", () => {
    const { rerender } = render(<BackgroundLoadImage />);
    const img = screen.getByRole("img");
    expect(img).toHaveClass("photo", { exact: true });
    expect(img.parentElement).toHaveClass("container ", { exact: true });
    expect(img.previousElementSibling).toHaveClass("placeholderImg placeholder", { exact: true });

    rerender(<BackgroundLoadImage className="foo" placeholderClass="bar" imgClass="fizz" />)
    expect(img.parentElement).toHaveClass("container foo", { exact: true });
    expect(img.previousElementSibling).toHaveClass("placeholderImg placeholder bar", { exact: true });
    expect(img).toHaveClass("photo fizz", { exact: true });
  })
})