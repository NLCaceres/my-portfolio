import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Footer from "./Footer";

describe("renders a footer using a nav", () => {
  test("accepting a contact button click callback", async () => {
    const user = userEvent.setup();
    const contactButtonClickCallback = jest.fn();
    const { rerender } = render(<Footer contactButtonOnClick={contactButtonClickCallback} />);
    
    await user.click(screen.getByRole("button", { name: /contact me/i }));
    expect(contactButtonClickCallback).toHaveBeenCalledTimes(1);

    rerender(<Footer />);
    await user.click(screen.getByRole("button", { name: /contact me/i }));
    expect(contactButtonClickCallback).toHaveBeenCalledTimes(1);
  })
  test("with specific css modules", () => {
    render(<Footer />);
    const navParent = screen.getByRole("navigation");
    expect(navParent).toHaveClass("navFooter navbar navbar-expand-md navbar-dark", { exact: true });

    const navLinkModalButton = screen.getByRole("button", { name: /contact me/i });
    expect(navLinkModalButton).toHaveClass("contactButton btn btn-outline-dark", { exact: true });

    const nameSpan = screen.getByText(/built by/i);
    expect(nameSpan).toHaveClass("navbar-text navbarText text-dark", { exact: true });
    const reactSpan = screen.getByText(/crafted with/i);
    expect(reactSpan).toHaveClass("navbar-text navbarText text-dark", { exact: true });
    const herokuSpan = screen.getByText(/powered by/i);
    expect(herokuSpan).toHaveClass("navbar-text navbarText text-dark", { exact: true });
  })
})