import React from "react";
import { render, screen } from '@testing-library/react';
import Footer from "./Footer";
import { mobileHighEndWidth, smallTabletViewWidth } from "../Utility/Constants/Viewports"

describe("renders a footer using a nav", () => {
  test("that uses a navLink on thinner views and button on wider views", () => {
    //* NavLink to contact page
    const { rerender } = render(<Footer viewWidth={mobileHighEndWidth} />)
    const navLinkFound = screen.getByRole('link', { name: /contact me/i });
    expect(navLinkFound).toBeInTheDocument();

    //* Normal button to open contact me modal
    rerender(<Footer viewWidth={smallTabletViewWidth} />)
    const modalButtonFound = screen.getByRole('button', { name: /contact me/i });
    expect(modalButtonFound).toBeInTheDocument();
  })
  test('with specific css modules', () => {
    const { rerender } = render(<Footer viewWidth={mobileHighEndWidth} />)
    const navParent = screen.getByRole('navigation');
    expect(navParent).toHaveClass('navFooter');

    const navLink = screen.getByRole('link', { name: /contact me/i });
    expect(navLink).toHaveClass('navLink');
    expect(navLink).toHaveAttribute('href', '/contact-me');

    rerender(<Footer viewWidth={smallTabletViewWidth} />)
    const modalButton = screen.getByRole('button', { name: /contact me/i });
    expect(modalButton).toHaveClass('contactButton');

    const nameSpan = screen.getByText(/built by/i);
    expect(nameSpan).toHaveClass('navbarText');
    const reactSpan = screen.getByText(/crafted with/i);
    expect(reactSpan).toHaveClass('navbarText');
    const herokuSpan = screen.getByText(/powered by/i);
    expect(herokuSpan).toHaveClass('navbarText');
  })
})