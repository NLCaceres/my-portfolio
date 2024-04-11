import { ElementType } from "react";
import Spinner from "react-bootstrap/Spinner";

type SpinnerProps = {
  tag?: ElementType, //? Allow ElementType to use its default typing (giving nice autocomplete for acceptable HTML tag names)
  className?: string, color?: string, small?: boolean
};
//* Create a simple to use Spinner with accessibility in mind by default!
const AppSpinner = ({ tag, className, color, small }: SpinnerProps) => {
  //? Adding "aria-hidden='true'" prop may hide the invisible span inside from screen readers
  //? BUT dropping the span inside may be needed if the spinner sits in a button (possibly calling for "aria-hidden" again)
  return (
    <Spinner animation="border" role="status" as={tag || "div"} className={`${className || ""} me-2`} variant={ color } size={small ? "sm" : undefined}>
      <span className="visually-hidden">
        Loading...
      </span>
    </Spinner>
  );
};

export default AppSpinner;