import React from "react";
import { render, screen } from "@testing-library/react";
import AppSpinner from "./AppSpinner";

describe("renders an app standard styled spinner", () => {
  test("as a div or the specified element", () => {
    const { rerender } = render(<AppSpinner />)
    const alert = screen.getByRole("status");
    expect(alert.tagName).toBe("DIV");

    rerender(<AppSpinner tag="span" />)
    const spanAlert = screen.getByRole("status");
    expect(spanAlert.tagName).toBe("SPAN");
  })
  test("with a predefined list of classes and the option to add more", () => {
    const { rerender } = render(<AppSpinner />)
    const alert = screen.getByRole("status");
    expect(alert).toHaveClass("me-2")

    rerender(<AppSpinner className={"foobar"} />)
    expect(alert).toHaveClass("foobar");
    expect(alert).toHaveClass("foobar me-2 spinner-border", { exact: true });
  })
  test("in two sizes, standard and small", () => {
    const { rerender } = render(<AppSpinner />)
    const alert = screen.getByRole("status");
    expect(alert).toHaveClass("spinner-border"); //* Standard size spinner
    expect(alert).not.toHaveClass("spinner-border-sm");

    rerender(<AppSpinner small />)
    expect(alert).toHaveClass("spinner-border-sm"); //* Gets rendered smaller!
  })
  test("in a variety of colors", () => {
    const { rerender } = render(<AppSpinner color={"primary"} />)
    const alert = screen.getByRole("status");
    expect(alert).toHaveClass("text-primary");

    rerender(<AppSpinner color={"danger"} />)
    expect(alert).toHaveClass("text-danger");

    rerender(<AppSpinner color={"info"} />)
    expect(alert).toHaveClass("text-info");

    rerender(<AppSpinner color={"success"} />)
    expect(alert).toHaveClass("text-success");
    //* There's also secondary, warning, light, and dark
  })
})