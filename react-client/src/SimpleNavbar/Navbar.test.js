import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import SimpleNavbar from "./SimpleNavbar";
import { averageTabletViewWidth, smallTabletHighEndWidth } from "../Utility/Constants/Viewports";
import { MemoryRouter } from 'react-router-dom';

describe("renders a simple styled navbar", () => {
  test("that reorders itself on smaller screens", () => {
    const { rerender } = render(<SimpleNavbar viewWidth={averageTabletViewWidth}/>, { wrapper: MemoryRouter })
    const collapseView = screen.getByTestId('nav-collapse');
    expect(collapseView).not.toHaveClass('order-2')

    const navItemContainer = collapseView.firstChild;
    expect(navItemContainer).toHaveClass('flex-row')
    expect(navItemContainer).not.toHaveClass('flex-column')

    rerender(<SimpleNavbar viewWidth={smallTabletHighEndWidth}/>, { wrapper: MemoryRouter })
    expect(collapseView).toHaveClass('order-2')
    expect(navItemContainer).not.toHaveClass('flex-row')
    expect(navItemContainer).toHaveClass('flex-column')
  })
  test("that sets up navBrand + 4 specific navLinks with a scroll up on click and parent navItem inline-styled", async () => {
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
    expect(backEndNavItem).toHaveStyle('height: 40px');
  })
})