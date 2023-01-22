import React from "react"
import { render, screen } from '@testing-library/react';
import ContactPage from '.';
import { averageTabletLowEndWidth, averageTabletViewWidth } from "../Utility/Constants/Viewports";

//? jest.mock() hoists above imports which makes it file wide and work for every test below SO
//? If a per-test option is needed, must use "jest.doMock()" (See ContactPageForm.test for example)
jest.mock('../Utility/Components/TurnstileWidget', () => ({action, successCB, className }) => {
  return (<div>Dummy Node</div>);
}); 

describe("renders a simple contact page with a form component", () => {
  test("that accepts a custom onMount + onUnmount function", () => {
    const mountingSpy = jest.fn();
    const { unmount } = render(<ContactPage onMount={mountingSpy}/>)
    expect(mountingSpy).toHaveBeenCalledTimes(1);
    unmount();
    expect(mountingSpy).toHaveBeenCalledTimes(2);
  })
  test("with a parent & form container using css modules, & form in dark mode", () => {
    render(<ContactPage />);
    const headerTag = screen.getByRole('heading', { name: /contact me page!/i });
    const parentContainer = headerTag.parentElement;
    expect(parentContainer).toBeInTheDocument();
    expect(parentContainer).toHaveClass('contact-page')

    const formParentContainer = headerTag.nextSibling;
    expect(formParentContainer).toBeInTheDocument();
    expect(formParentContainer).toHaveClass('form-parent-container py-2 px-3')

    const formComponent = formParentContainer.firstChild;
    expect(formComponent).toBeInTheDocument();
    expect(formComponent).toHaveClass('dark');
  })
  test("that depends on viewWidth for correct title font size", () => {
    const { rerender } = render(<ContactPage viewWidth={averageTabletLowEndWidth} />);
    const title = screen.getByRole('heading', { name: /contact me page/i });
    expect(title).toHaveClass('display-3');
    rerender(<ContactPage viewWidth={averageTabletViewWidth} />);
    expect(title).toHaveClass('display-2');
  })
})