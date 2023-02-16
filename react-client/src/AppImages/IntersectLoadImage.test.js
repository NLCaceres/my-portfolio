import React from "react";
import { render, screen } from "@testing-library/react";
import IntersectLoadImage from "./IntersectLoadImage";
import * as ReactSpring from "@react-spring/web";

describe("rendering a 'BackgroundLoadImage' component that only begins load on intersection", () => {
  test("injecting the src upon crossing a '0.6' threshold", async () => {
    //? Though I doubt I can test the threshold or other config, I can mock useInView to return what I want
    //? Only current problem is it's a getter that can't seem to be mocked either due to a Jest bug or a React-Spring one
    //? Cypress may be able to handle this better, in a similar way to testing the hover indicators of the AppCarousel
    //const useInViewSpy = jest.spyOn(ReactSpring, "useInView", "get").mockReturnValueOnce([null, false])
    const { rerender } = render(<IntersectLoadImage src="foobar.jpeg" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", ""); //* Bad src is injected so no loading occurs

    //todo Eventually this may work, or simply start running Cypress tests soon
    //useInViewSpy.mockReturnValueOnce([null, true]) //* Intersection occurred!
    //rerender(<IntersectLoadImage src="foobar.jpeg" />); //* So upon rerender
    //expect(img).toHaveAttribute("src", "foobar.jpeg"); //* Src is injected and real loading begins

    // jest.restoreAllMocks();
  })
})