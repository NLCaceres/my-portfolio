import { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import FloatingAlertCss from "./AppAlert.module.css";

//! An Alert to display for a variety of messages across the app, front and center floating at the bottom of the page

//* Alert State for those that only appear briefly (closing on timeout)
export type AlertState = { title?: string, message?: string, color?: string, timeoutID?: NodeJS.Timeout };
export type AlertHandler = ({ title, message, color }: AlertState) => void;

//* Currently used for contact-me email submission: Green on success & red on error
type AlertProps = {
  title?: string, message?: string, color?: string, onClose?: () => void
};
//@params - 1/2: title & message simply determine if a 'h' or 'p' tag are required, and then display the text
//@params - 3: color works based on Bootstrap variants - primary, secondary, info, warning, danger, success
//@params - 4: onClose provides a callback for the parent to fire when the alert is dismissed
//@params - 4: onClose SHOULD also undefine title/message. The alert closes no matter what BUT if the title/message doesn't change next time,
//@params - 4: then the next rerender WON'T run useEffect, therefore it won't re-evaluate if the alert should show
const AppAlert = ({ title, message, color, onClose }: AlertProps) => {
  const [show, setShow] = useState(false); //* Should be hidden first

  useEffect(() => { //* Ensure if parent sets new title or message, update visibility
    const newShow = !!(title || message); //* Force conversion to boolean
    setShow(newShow);
  }, [title, message]);

  const hideAlert = () => {
    setShow(false); //* Force to hide, which makes Bootstrap remove it from the DOM entirely BUT still in React's virtual DOM
    if (onClose) { onClose(); }
  };

  //? Rather than use React-Bootstrap Alert's 'show' prop, let its onClose control this component's show state so
  return (show) ?
    ( //* If a title or text prop is present, then show this alert, otherwise both must be undefined to hide it
      <Alert className={`${FloatingAlertCss.floatingAlert}`} variant={ color } onClose={ hideAlert } dismissible>
        {title && <Alert.Heading>{ title }</Alert.Heading> /*//* Title required or don't render a title header */ }
        {message && <p>{ message }</p> /*//* Message required or don't render the 'p' tag */ }
      </Alert>
    )
    : undefined;
}; //? This component could be quite simple and skip out on useEffect and useState BUT it loses testability since
//? aside from changes to its own props, it would depend on its parent rerendering to cause changes to react-bootstrap's Alert
//? Alternatively useEffect without a dependency array would let it run after every render w/out necessarily causing infinite renders
//? BUT the testability issue still occurs plus # of rerenders goes from 4 rerenders with the array vs 7 w/out it

export default AppAlert;