import { render, screen } from "@testing-library/react";
import PlaceholderImg from "./PlaceholderImg";

describe("renders a div that looks like a placeholder img", () => {
  test("using a lookalike header tag in a container div", () => {
    render(<PlaceholderImg />);
    const headerTag = screen.getByRole("heading");
    expect(headerTag).toBeInTheDocument();
    expect(headerTag).toHaveClass("placeholderText");
  });
  test("with optional css classes for the container div", () => {
    const { rerender } = render(<PlaceholderImg />);
    const containerTag = screen.getByRole("heading").parentElement;
    expect(containerTag).toHaveClass("placeholderImg");

    rerender(<PlaceholderImg className="foobar" />);
    expect(containerTag).toHaveClass("placeholderImg foobar", { exact: true });
  });
  test("with either a default 'Project' text, text of choice, or a new element", () => {
    const { rerender } = render(<PlaceholderImg />);
    const headerTag = screen.getByRole("heading", { name: "Project" });
    expect(headerTag).toHaveTextContent("Project");

    rerender(<PlaceholderImg>Foobar</PlaceholderImg>);
    expect(headerTag).toHaveTextContent("Foobar");

    rerender(<PlaceholderImg><h3>Hello World!</h3></PlaceholderImg>);
    expect(screen.getByRole("heading", { level: 3 })); //* Instead of a h2 tag, replace it and find a h3 tag
  });
  test("with an option to add style attributes to the heading and container 'div'", () => {
    const { rerender } = render(<PlaceholderImg style={{ opacity: 0 }} textStyle={{ opacity: 1 }}/>);
    const headerTag = screen.getByRole("heading", { name: "Project" });
    expect(headerTag).toHaveStyle({ opacity: 1 });

    const containerDiv = headerTag.parentElement;
    expect(containerDiv).toHaveStyle({ opacity: 0 });

    rerender(<PlaceholderImg style={{ height: 200 }} textStyle={{ color: "red" }} />);
    expect(headerTag).toHaveStyle({ color: "rgb(255, 0, 0)" }); //* Testing-Lib seems to be convert "color: red" to "color: rgb()"
    expect(containerDiv).toHaveStyle({ height: "200px" });

    rerender(<PlaceholderImg />);
    expect(headerTag).toHaveAttribute("style", "");
    expect(containerDiv).toHaveAttribute("style", "");
  });
  test("with the option to render a spinner if an image is loading", () => {
    const { rerender } = render(<PlaceholderImg />);
    const missingSpinner = screen.queryByRole("status");
    expect(missingSpinner).not.toBeInTheDocument();

    rerender(<PlaceholderImg loading={true} />);
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();

    rerender(<PlaceholderImg />);
    expect(spinner).not.toBeInTheDocument();
  });
});