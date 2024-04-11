import withClassName from "./WithClassName";
import { render, screen } from "@testing-library/react";

describe("renders any component passed in with the desired classes", () => {
  test("via higher order function that accepts a render func and class string", () => {
    // @ts-expect-error: withClassName expects an HOC, NOT a JSX Element
    const BadArgComponent = withClassName(<div></div>, "foobar");
    expect(BadArgComponent).toThrow(TypeError); //* BadArgComponent throws a TypeError if used BECAUSE
    //* the HOC expects a render func to use and destructure out the render funcs className prop

    //* Valid to pass any render func in BUT it needs to accept a className prop
    const ProperArgComponent = withClassName(() => <div data-testid="failed-hoc" />, "foobar");
    render(<ProperArgComponent />);
    const failedHocDiv = screen.getByTestId("failed-hoc");
    expect(failedHocDiv).not.toHaveAttribute("class"); //* Or else it won't get any classes put on it

    //* By accepting a className prop that actually sets the Component's classes, THEN
    const SuccessArgComponent = withClassName(({className}) => <div data-testid="success-hoc" className={className} />, "foobar");
    render(<SuccessArgComponent />);
    const successHocDiv = screen.getByTestId("success-hoc");
    expect(successHocDiv).toHaveClass("foobar"); //* We can successfully apply specific classes via the HOC func
  });
  test("with a convenient display name for React Debug Tools", () => {
    const SomeComponent = () => <div data-testid="failed-hoc" />;
    SomeComponent.displayName = "SomeComponent";
    const HocDiv = withClassName(SomeComponent, "foobar");
    expect(HocDiv.displayName).toBe("SomeComponent-with-foobar-CSS-class");

    const ValidComponent = ({ className }: { className: string }) => <div data-testid="success-hoc" className={className} />;
    ValidComponent.displayName = "Valid-Component";
    const ValidHocDiv = withClassName(ValidComponent, "BARFOO");
    expect(ValidHocDiv.displayName).toBe("Valid-Component-with-BARFOO-CSS-class");
  });
});