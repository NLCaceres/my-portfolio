import React from "react";
import { render, screen } from "@testing-library/react";
import AppSpinner from "./AppSpinner";

describe("renders an app standard styled spinner", () => {
  test("as a div or the specified element", () => {
    const { rerender } = render(<AppSpinner />)
    const spinner = screen.getByRole("status");
    expect(spinner.tagName).toBe("DIV");

    rerender(<AppSpinner tag="span" />)
    const spanSpinner = screen.getByRole("status");
    expect(spanSpinner.tagName).toBe("SPAN");
  })
  test("with a predefined list of classes and the option to add more", () => {
    const { rerender } = render(<AppSpinner />)
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("me-2")

    rerender(<AppSpinner className={"foobar"} />)
    expect(spinner).toHaveClass("foobar");
    expect(spinner).toHaveClass("foobar me-2 spinner-border", { exact: true });
  })
  test("in two sizes, standard and small", () => {
    const { rerender } = render(<AppSpinner />)
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("spinner-border"); //* Standard size spinner
    expect(spinner).not.toHaveClass("spinner-border-sm");

    rerender(<AppSpinner small />)
    expect(spinner).toHaveClass("spinner-border-sm"); //* Gets rendered smaller!
  })
  test("in a variety of colors", () => {
    const { rerender } = render(<AppSpinner color={"primary"} />)
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("text-primary");

    rerender(<AppSpinner color={"danger"} />)
    expect(spinner).toHaveClass("text-danger");

    rerender(<AppSpinner color={"info"} />)
    expect(spinner).toHaveClass("text-info");

    rerender(<AppSpinner color={"success"} />)
    expect(spinner).toHaveClass("text-success");
    //* There's also secondary, warning, light, and dark
  })
})