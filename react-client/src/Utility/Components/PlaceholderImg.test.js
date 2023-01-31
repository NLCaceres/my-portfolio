import React from "react";
import { render, screen } from "@testing-library/react";
import PlaceholderImg from "./PlaceholderImg";

describe("renders a div that looks like a placeholder img", () => {
  test("using a lookalike header tag in a container div", () => {
    render(<PlaceholderImg />);
    const headerTag = screen.getByRole("heading");
    expect(headerTag).toBeInTheDocument();
    expect(headerTag).toHaveClass("placeholderText");
  })
  test("with optional css classes for the container div", () => {
    const { rerender } = render(<PlaceholderImg />);
    const containerTag = screen.getByRole("heading").parentElement;
    expect(containerTag).toHaveClass("placeholderImg");
    
    rerender(<PlaceholderImg className="foobar" />)
    expect(containerTag).toHaveClass("placeholderImg foobar", { exact: true });
  })
  test("with either a default 'Project' text or text of choice", () => {
    const { rerender } = render(<PlaceholderImg />);
    const headerTag = screen.getByRole("heading", { name: "Project" });
    expect(headerTag).toHaveTextContent("Project");

    rerender(<PlaceholderImg>Foobar</PlaceholderImg>)
    expect(headerTag).toHaveTextContent("Foobar");
  })
  test("with the option to render a spinner if an image is loading", () => {
    const { rerender } = render(<PlaceholderImg />);
    const missingAlert = screen.queryByRole("status");
    expect(missingAlert).not.toBeInTheDocument();

    rerender(<PlaceholderImg loading={true} />);
    const alertFound = screen.getByRole("status");
    expect(alertFound).toBeInTheDocument();

    rerender(<PlaceholderImg />);
    expect(alertFound).not.toBeInTheDocument();
  })
})