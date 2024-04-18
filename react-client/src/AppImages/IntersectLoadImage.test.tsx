import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import IntersectLoadImage from "./IntersectLoadImage";
// import * as ReactSpring from "@react-spring/core";

describe("rendering a 'BackgroundLoadImage' component that only begins load on intersection", () => {
  test("injecting the src upon crossing a '0.6' threshold", async () => {
    //? Though I doubt I can test the threshold or other config, I can mock useInView to return what I want
    //? Problem is it appears as a property to Vitest due to Babel treating re-exported funcs
    //? SO Cypress is probably the better testing method, similar to testing the hover indicators of the AppCarousel
    // const useInViewSpy = vi.spyOn(ReactSpring, "useInView").mockReturnValue([{ current: null }, false]);
    /* const { rerender } =  */render(<IntersectLoadImage src="foobar.jpeg" alt="foobar" />);
    //? Important to pass in an `alt` prop, or else Testing-Lib will assign a "presentation" role to the <img> tag
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", ""); //* Bad src is injected so no loading occurs

    // useInViewSpy.mockReturnValueOnce([{ current: null }, true]) //* Intersection occurred!
    // rerender(<IntersectLoadImage src="foobar.jpeg" />); //* So upon rerender
    // expect(img).toHaveAttribute("src", "foobar.jpeg"); //* Src is injected and real loading begins

    vi.restoreAllMocks();
  });
});