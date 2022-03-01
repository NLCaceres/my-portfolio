import React from "react"
import { render, screen } from '@testing-library/react';
import ContactPage from '.';

//? jest.mock() hoists above imports so use jest.doMock() as a per test option
jest.mock('../Utility/Hooks/UseRecaptcha', () => {
  //? Only need a partial mock? Store jest.requireActual('dir') in originalModule var, then add '...originalModule' to following obj
  return {
    __esModule: true, 
    default: () => 1,
  }
})

describe("renders a simple contact page with a form component", () => {
  test("that accepts a custom onMount + onUnmount function", () => {
    const mountingSpy = jest.fn();
    const { unmount } = render(<ContactPage onMount={mountingSpy}/>)
    expect(mountingSpy).toHaveBeenCalledTimes(1);
    unmount();
    expect(mountingSpy).toHaveBeenCalledTimes(2);
  })
  test("with an inline-styled container, form container with css modules, & form in dark mode", () => {
    render(<ContactPage />);
    const headerTag = screen.getByRole('heading', { name: /contact me page!/i });
    const parentContainer = headerTag.parentElement;
    expect(parentContainer).toBeInTheDocument();
    expect(parentContainer).toHaveStyle('paddingLeft: 10px; paddingRight: 10px')

    const formParentContainer = headerTag.nextSibling;
    expect(formParentContainer).toBeInTheDocument();
    expect(formParentContainer).toHaveClass('form-parent-container py-2 px-3')

    const formComponent = formParentContainer.firstChild;
    expect(formComponent).toBeInTheDocument();
    expect(formComponent).toHaveClass('dark');
  })
})