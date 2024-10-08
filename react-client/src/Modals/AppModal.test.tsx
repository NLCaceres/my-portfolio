import AppModal from "./AppModal";
import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";

describe("renders a react-bootstrap modal", () => {
  //* Root
  test("creating a unique id via prop or utility func for the root and title tags", () => {
    const { rerender } = render(
      <AppModal show={true} title={"FoobarTitle"}>
        <h3>Foobar</h3>
      </AppModal>
    );
    const modalRoot = screen.getByRole("dialog"); //* Grabs just the important stuff - the modal (no aria-hidden or faded background)
    expect(modalRoot).toBeInTheDocument();
    expect(modalRoot).toHaveAttribute("aria-labelledby", "modal-1");
    const titleTagFound = screen.getByText("FoobarTitle");
    expect(titleTagFound).toHaveAttribute("id", "modal-1");
    rerender(
      <AppModal show={true} ID="foobar" title={"FoobarTitle"}>
        <h3>Foobar</h3>
      </AppModal>
    );
    expect(modalRoot).toHaveAttribute("aria-labelledby", "foobar-modal");
    expect(titleTagFound).toHaveAttribute("id", "foobar-modal");
  });

  test("requiring a body, optionally a title + footer, as strings or tags", () => {
    const { rerender } = render(
      <AppModal show={true} ID="foobar" title={"FoobarTitle"} footer={"FoobarFooter"}>
        <h3>Barfoo</h3>
      </AppModal>
    );
    const modalTitle = screen.getByRole("heading", { name: /foobartitle/i });
    expect(modalTitle).toBeInTheDocument();
    const modalHeader = modalTitle.parentElement; //* Without title header doesn't render
    const modalBody = screen.getByRole("heading", { name: /barfoo/i }).parentElement;
    expect(modalBody).toBeInTheDocument();
    const modalFooter = screen.getByText(/foobarfooter/i);
    expect(modalFooter).toBeInTheDocument();

    const footerTag = <h2>FoobarFooter</h2>;
    rerender(<AppModal show={true} ID="foobar" footer={footerTag}> <h3>Foobar</h3> </AppModal>);
    const modalContent = modalBody!.parentElement;
    expect(modalContent).toContainHTML(renderToStaticMarkup(footerTag)); //* Check JSX renders as expected

    rerender(<AppModal show={true} ID="foobar"> <h3>Foobar</h3> </AppModal>);
    expect(modalTitle).not.toBeInTheDocument();
    expect(modalHeader).not.toBeInTheDocument();
    expect(modalFooter).not.toBeInTheDocument();
    expect(modalBody).toBeInTheDocument();
  });

  //* CSS class - dialogBox, content, header, title, body, footer
  test("each section able to pass in and calculate its CSS classes", () => {
    const { rerender } = render(
      <AppModal show={true} ID="foobar" contentClasses={"content-class"} headerClasses={"header-class"} bodyClasses={"body-class"}
                titleClasses={"title-class"} title={"FoobarTitle"} footerClasses={"footer-class"} footer={"FoobarFooter"}>
        <h3>Barfoo</h3>
      </AppModal>
    );
    const modalDialogBox = screen.getByRole("dialog").firstChild;
    expect(modalDialogBox).toHaveClass("dialogBox");

    const modalContent = modalDialogBox!.firstChild; //* Content within dialogBox which is in modal parent
    expect(modalContent).toHaveClass("content-class");
    expect(modalContent).toHaveClass("modal-content content content-class", { exact: true });

    const modalHeader = modalContent!.firstChild;
    expect(modalHeader).toHaveClass("header-class");
    expect(modalHeader).toHaveClass("modal-header header-class", { exact: true });

    const modalTitle = modalHeader!.firstChild;
    expect(modalTitle).toHaveClass("title-class");
    expect(modalTitle).toHaveClass("fs-3 title-class modal-title", { exact: true });

    const modalBody = screen.getByRole("heading", { name: /barfoo/i }).parentElement;
    expect(modalBody).toHaveClass("body-class"); //* Could use toHaveAttribute() to test EXACT string match (but possibly TOO specific)
    expect(modalBody).toHaveAttribute("class", "body-class modal-body"); //* Order matters! Leading + trailing whitespace too!

    const modalFooter = screen.getByText(/foobarfooter/i);
    expect(modalFooter).toHaveClass("footer-class");
    expect(modalFooter).toHaveClass("modal-footer footer-class", { exact: true });

    rerender(
      <AppModal show={true} ID="foobar" title={"FoobarTitle"} footer={"FoobarFooter"}>
        <h3>Foobar</h3>
      </AppModal>
    );
    expect(modalContent).not.toHaveClass("content-class");
    expect(modalHeader).not.toHaveClass("header-class");
    expect(modalTitle).not.toHaveClass("header-class");
    expect(modalBody).not.toHaveClass("body-class");
    expect(modalFooter).not.toHaveClass("footer-class");
  });

  test("fires a custom onHide func when close button clicked", async () => {
    const mockFunc = vi.fn();
    const user = userEvent.setup();
    render(<AppModal show={true} onHide={mockFunc} ID="foobar" title={"FoobarTitle"} />);
    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(mockFunc).toHaveBeenCalled();
    //TODO: Rerender with show = false WON'T call onHide, SO a Cypress test is better
  });
});