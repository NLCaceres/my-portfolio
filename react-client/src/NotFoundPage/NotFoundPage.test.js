import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import NotFoundPage from "./NotFoundPage";

describe("renders a basic but fun 'Not Found' Page", () => {
  test("using a placeholder to cover the loading image before unveiling", () => {
    render(<NotFoundPage />);
    const placeholder = screen.getByRole("heading", { name: /puppy incoming/i }).parentElement;
    fireEvent.load(screen.getByRole("img"));
    expect(placeholder).not.toBeInTheDocument();
  })
  test("with simple css modules for each element", () => {
    render(<NotFoundPage />);
    const titleTag = screen.getByText(/sorry/i);
    const containerTag = titleTag.parentElement;
    expect(containerTag).toHaveClass("container");
    const placeholder = screen.getByRole("heading", { name: /puppy incoming/i }).parentElement;
    expect(placeholder).toHaveClass("placeholderImg loadingImage");
    const pupImage = screen.getByRole("img");
    expect(pupImage).toHaveClass("pupImage");
    const descriptionTag = screen.getByRole("heading", { name: /so here's a puppy to make up for it/i });
    expect(descriptionTag).toHaveClass("caption")
  })
  test("keeping its img across basic rerenders", () => {
    const { rerender } = render(<NotFoundPage />);
    const puppyImgTag = screen.getByRole("img", { name: /a cute pup/i });
    expect(puppyImgTag).toHaveClass("pupImage");
    const oldPuppyImgSrc = puppyImgTag.src;
    rerender(<NotFoundPage />); //* If same url (no navigation), a rerender won't change the img
    expect(puppyImgTag.src).toMatch(oldPuppyImgSrc);
    //* Could expect() a new img via unmount or a new render BUT 
    //* 1 in 10 odds the same img appears anyway so no real certainty the test passes
  })
})