import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import IntersectLoadImage from "./IntersectLoadImage";
// import * as ReactSpring from "@react-spring/web";

describe("rendering a 'BackgroundLoadImage' component that only begins load on intersection", () => {
  test("injecting the src upon crossing a '0.6' threshold", async () => {
    //? Though I doubt I can test the threshold or other config, I can mock useInView to return what I want
    //? Problem is it appears as a property to Vitest due to Babel treating re-exported funcs
    //? SO Cypress is probably the better testing method, similar to testing the hover indicators of the AppCarousel
    // const useInViewSpy = vi.spyOn(ReactSpring, "useInView").mockReturnValue([{ current: null }, false]);
    /* const { rerender } =  */render(<IntersectLoadImage src="foobar.jpeg" alt="foobar" />);
    //? `alt` prop NEEDED, else Testing-Lib assigns "presentation" role to the <img> tag
    const img = screen.getByRole("img");
    //* Img not loaded since not intersected, which makes src attr == ""
    expect(img).not.toHaveAttribute("src"); // and React 19 makes undefined

    // useInViewSpy.mockReturnValueOnce([{ current: null }, true]) //* Intersection occurred!
    // rerender(<IntersectLoadImage src="foobar.jpeg" />); //* So upon rerender
    // expect(img).toHaveAttribute("src", "foobar.jpeg"); //* Src is injected and real loading begins

    vi.restoreAllMocks();
  });
});
