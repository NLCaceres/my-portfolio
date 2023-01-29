import React from "react";
import { render, screen } from "@testing-library/react";
import NotFoundPage from "./NotFoundPage";

describe("renders a basic but fun 'Not Found' Page", () => {
  test("with a div container inline-styled with a left + right padding", () => {
    render(<NotFoundPage />)
    const titleTag = screen.getByText(/sorry/i);
    const containerTag = titleTag.parentElement;
    expect(containerTag).toBeInTheDocument();
    expect(containerTag).toHaveClass("container");
  })
  test("with an img tag with a random src + an 'img-thumbnail' cssModule", () => {
    const { rerender } = render(<NotFoundPage />);
    const puppyImgTag = screen.getByRole("img", { name: /a cute pup/i });
    expect(puppyImgTag).toHaveClass("pupImage");
    const oldPuppyImgSrc = puppyImgTag.src;
    rerender(<NotFoundPage />); //* If same url (no navigation), a rerender won't change the img
    expect(puppyImgTag.src).toMatch(oldPuppyImgSrc);
    //* Following handles expecting a new img every unmount + init render BUT 
    //* 1 in 10 odds end up w/ same img so no true certainity test passes
    // unmount();
    // render(<NotFoundPage />);
    // expect(puppyImgTag).not.toBeInTheDocument();
    // const newPuppyImgTag = screen.getByRole('img', { name: /a cute pup/i });
    // console.log(newPuppyImgTag.src);
    // expect(newPuppyImgTag.src).not.toContain(oldPuppyImgSrc);
  })
  test("with a 'h4' tag styled with a top margin", () => {
    render(<NotFoundPage />)
    const descriptionTag = screen.getByRole("heading", { name: /so here's a puppy to make up for it/i });
    expect(descriptionTag).toHaveClass("caption")
  })
})