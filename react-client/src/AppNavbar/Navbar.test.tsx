//import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AppNavbar from "./AppNavbar";
import * as Scroll from "../Utility/Functions/Browser";
import { createRootRoute, createRouter, RouterProvider } from "@tanstack/react-router";

const testRouter = () =>
  createRouter({ routeTree: createRootRoute({ component: AppNavbar }) });

describe("renders a simple styled navbar", () => {
  test("that reorders itself on smaller screens via css modules", async () => {
    render(<RouterProvider router={testRouter()} />);
    const collapseView = await screen.findByTestId("nav-collapse");
    expect(collapseView).toHaveClass("nav-collapse");

    const navItemContainer = collapseView.firstChild;
    expect(navItemContainer).toHaveClass("nav-container");
  });
  describe("setting up a navBrand + 4 specific navLinks", () => {
    test("via a mapping function", async () => {
      render(<RouterProvider router={testRouter()} />);
      const navBrand = await screen.findByRole("link", { name: /brand logo/i });
      expect(navBrand).toBeInTheDocument();

      const iOSNavLink = screen.getByText("iOS");
      expect(iOSNavLink).toBeInTheDocument();
      expect(iOSNavLink.parentElement).toBeInTheDocument(); //* NavItem parent

      const androidNavLink = screen.getByText("Android");
      expect(androidNavLink).toBeInTheDocument();
      expect(androidNavLink.parentElement).toBeInTheDocument(); //* NavItem parent

      const frontEndNavLink = screen.getByText("Front-End Web");
      expect(frontEndNavLink).toBeInTheDocument();
      expect(frontEndNavLink.parentElement).toBeInTheDocument(); //* NavItem parent

      const backEndNavLink = screen.getByText("Back-End Web");
      expect(backEndNavLink).toBeInTheDocument();
      expect(backEndNavLink.parentElement).toBeInTheDocument(); //* NavItem parent
    });
    test("with a scroll up on click of a link", async () => {
      const scrollSpy = vi.spyOn(Scroll, "SmoothScroll").mockImplementation(() => 1);
      const user = userEvent.setup();
      render(<RouterProvider router={testRouter()} />);

      await user.click(await screen.findByText("Back-End Web"));
      expect(scrollSpy).toHaveBeenCalled();

      scrollSpy.mockRestore();
    });
    test("with specific CSS attributes", async () => {
      const scrollSpy = vi.spyOn(Scroll, "SmoothScroll").mockImplementation(() => 1); //* Prevents "scrollTo not implemented" error
      const user = userEvent.setup();
      render(<RouterProvider router={testRouter()} />);

      const navBrand = await screen.findByRole("link", { name: /brand logo/i });
      expect(navBrand).toHaveClass("brand navbar-brand", { exact: true });
      expect(navBrand).toHaveAttribute("href", "/portfolio/about-me");
      expect(navBrand.lastChild).toHaveAttribute("alt", "Brand Logo"); // Matches parent Link name

      const backEndNavLink = screen.getByText("Back-End Web");
      expect(backEndNavLink).toBeInTheDocument();
      expect(backEndNavLink).toHaveClass("nav-link navButton"); //* Currently not the active route

      await user.click(backEndNavLink); //* Navigate to navLink's destination

      const backEndNavItem = backEndNavLink.parentElement;
      expect(backEndNavItem).toHaveClass("border border-dark rounded navItem");
      expect(backEndNavLink).toHaveClass("nav-link navButton active"); //* Now the activeRoute

      scrollSpy.mockRestore();
    });
  });
});
