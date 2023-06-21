import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AppAlert from "./AppAlert";

describe("renders a reusable App-wide Bootstrap alert with", () => {
  describe("specific app-themed style", () => {
    test("like its container with a 'floatingAlert' css module + dismissable class", () => {
      render(<AppAlert title="Foobar" />);
      const container = screen.getByRole("alert")
      const alertContainer = screen.getByText(/foobar/i).parentElement;
      expect(alertContainer).toHaveClass("fade floatingAlert alert alert-dismissible");
      expect(container).toHaveClass("fade floatingAlert alert alert-dismissible");
    })
    test("using a bootstrap color variant prop", () => {
      const { rerender } = render(<AppAlert title="Foobar" color="primary" />);
      const alertContainer = screen.getByText(/foobar/i).parentElement;
      expect(alertContainer).toHaveClass("alert-primary");
      
      rerender(<AppAlert title="Foobar" color="danger" />);
      const alertContainerDanger = screen.getByText(/foobar/i).parentElement;
      expect(alertContainerDanger).toHaveClass("alert-danger");

      rerender(<AppAlert title="Foobar" color="success" />);
      const alertContainerSuccess = screen.getByText(/foobar/i).parentElement;
      expect(alertContainerSuccess).toHaveClass("alert-success");  

      rerender(<AppAlert title="Foobar" color="warning" />);
      const alertContainerWarning = screen.getByText(/foobar/i).parentElement;
      expect(alertContainerWarning).toHaveClass("alert-warning");
      //* There's also secondary, info, light and dark
    })
  })
  test("an 'onClose' prop called when the alert is dismissed via close button", async () => {
    const user = userEvent.setup();
    const onCloseMock = jest.fn();
    render(<AppAlert title="Foobar" onClose={onCloseMock} />)
    expect(screen.getByRole("alert")).toBeInTheDocument();
    
    await user.click(screen.getByRole("button"));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  })
  describe("visibility based on", () => {
    test("if the close button was pressed", async () => {
      const user = userEvent.setup();
      const { rerender } = render(<AppAlert title="Foobar" />)
      expect(screen.getByRole("alert")).toBeInTheDocument();

      await user.click(screen.getByRole("button")); //* Dismiss the alert
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();

      rerender(<AppAlert title="Barfoo" />); //* Title value updated so alert rerenders and sets show state to true
      expect(screen.getByRole("alert")).toBeInTheDocument();

      await user.click(screen.getByRole("button")); //* Dismiss it again
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();

      rerender(<AppAlert title="Barfoo" />); //* If the text props haven't changed value, React WON'T run the effect to make it visible again!
      expect(screen.queryByRole("alert")).not.toBeInTheDocument(); //! So it is IMPORTANT to undefine these props when closing the alert
    })
    test("if any text has been passed into the 'title' or 'text' prop", async () => {
      const { rerender } = render(<AppAlert />);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument(); //* Won't even appear without text of some kind
  
      rerender(<AppAlert title="Foobar" />);
      expect(screen.getByText("Foobar")).toBeInTheDocument(); //* Title renders
      expect(screen.queryByText("Barfoo")).not.toBeInTheDocument(); //* BUT no message paragraph
  
      rerender(<AppAlert message="Barfoo" />)
      expect(screen.queryByText("Foobar")).not.toBeInTheDocument(); //* No title rendering
      expect(screen.getByText("Barfoo")).toBeInTheDocument(); //* BUT message paragraph does render!
  
      rerender(<AppAlert title="Hello" message="World" />)
      expect(screen.getByText("Hello")).toBeInTheDocument(); //* BOTH title
      expect(screen.getByText("World")).toBeInTheDocument(); //* AND message render!
    })
  })
})
