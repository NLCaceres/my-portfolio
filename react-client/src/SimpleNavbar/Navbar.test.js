import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import SimpleNavbar from "./SimpleNavbar";
import { averageTabletViewWidth } from "../Utility/Constants/Viewports";
import { MemoryRouter } from 'react-router-dom';

describe("renders a simple styled navbar", () => {
  test("that reorders itself on smaller screens via css modules", () => {
    render(<SimpleNavbar viewWidth={averageTabletViewWidth}/>, { wrapper: MemoryRouter })
    const collapseView = screen.getByTestId('nav-collapse');
    expect(collapseView).toHaveClass('nav-collapse');

    const navItemContainer = collapseView.firstChild;
    expect(navItemContainer).toHaveClass('nav-container');
  })
  test("that sets up navBrand + 4 specific navLinks with a scroll up on click and parent navItem using css modules", async () => {
    const scrollSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => 1);
    const user = userEvent.setup();
    render(<SimpleNavbar viewWidth={averageTabletViewWidth}/>, { wrapper: MemoryRouter })

    const navBrand = screen.getByRole('link', { name: /brand logo/i });
    expect(navBrand).toBeInTheDocument();
    expect(navBrand).toHaveClass('brand');
    expect(navBrand).toHaveAttribute('href', '/');
    expect(navBrand.lastChild).toHaveAttribute('src', 'logo.svg');

    const iOSNavLink = screen.getByText('iOS')
    expect(iOSNavLink).toBeInTheDocument()

    const androidNavLink = screen.getByText('Android')
    expect(androidNavLink).toBeInTheDocument()

    const frontEndNavLink = screen.getByText('Front-End Web')
    expect(frontEndNavLink).toBeInTheDocument()

    const backEndNavLink = screen.getByText('Back-End Web')
    expect(backEndNavLink).toBeInTheDocument()

    await user.click(backEndNavLink);
    expect(scrollSpy).toHaveBeenCalled();  
    
    const backEndNavItem = backEndNavLink.parentElement;
    expect(backEndNavItem).toHaveClass('navItem');
    
    scrollSpy.mockRestore();
  })
})