import React from 'react';
import App from './App';
import { screen, render, act, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import ProjectFactory from '../Utility/Functions/Tests/ProjectFactory';
import * as GetPostList from '../Api/ProjectAPI';
import * as CommonAPI from "../Api/Common"

jest.mock("../Utility/Components/TurnstileWidget", () => ({action, successCB, className }) => {
  return (<div><button type="button" onClick={() => { successCB("123") }}>Turnstile Verification Button</button></div>);
})

describe("renders the whole app", () => {
  let ApiMock;
  beforeEach(() => {
    const majProject = ProjectFactory.create(); const minProject = ProjectFactory.create();
    ApiMock = jest.spyOn(GetPostList, 'default').mockImplementation(() => ({ majorProjects: [majProject], minorProjects: [minProject] }) );
  })
  afterEach(() => { jest.restoreAllMocks() })
  test("should control the opening of a contact-me modal onClick of the footer's contact me button", async () => {
    const user = userEvent.setup();
    render(<App />);
    //* Following ensures stubs have been inserted into DOM at '/portfolio/about-me'
    expect(ApiMock).toHaveBeenCalledTimes(1);

    const contactMeButton = await screen.findByRole('button', { name: /contact me/i });
    await user.click(contactMeButton);
    const modal = screen.getByRole("dialog");
    expect(modal).toBeInTheDocument();

    const modalCloser = screen.getByLabelText("Close");
    await user.click(modalCloser);
    await waitForElementToBeRemoved(modalCloser);
    expect(modal).not.toBeInTheDocument();
  });
  describe("controls the opening of an app-wide alert element", () => {
    const submitContactForm = async (user) => { //* Provide a reusable way of firing the contact form
      const contactMeButton = screen.getByRole('button', { name: /contact me/i });
      await user.click(contactMeButton); //* Open Contact Form Modal
      const modal = screen.getByRole("dialog");
      expect(modal).toBeInTheDocument();

      const emailInput = screen.getByLabelText("Email Address"); //* Input email address into form
      await user.type(emailInput, "someEmail@example.com");
      expect(emailInput).toHaveValue("someEmail@example.com");

      const messageInput = screen.getByLabelText("Message"); //* Input email message body into form
      await user.type(messageInput, "Hello World!");
      expect(messageInput).toHaveValue("Hello World!");

      await user.click(screen.getByRole('button', { name: /turnstile verification button/i })); //* Verify user is human

      const contactButtons = screen.getAllByRole('button', { name: /contact me/i }); //* Find the modal form's submit button
      const correctContactButton = (contactButtons[0].className === 'submitButton btn btn-primary') ? contactButtons[0] : contactButtons[1];
      await user.click(correctContactButton); //* Click the actual submit button (not the button used to open the modal)
    }
    const completeAlertTimeoutDismiss = () => { //! This tests if alert disappears on a 5s timeout
      //? Even if jest.useFakeTimers() was called here, line 59 "user.click" OR App's "setShowAlert" seemed to freeze the test, failing it
      act(() => { jest.advanceTimersByTime(6000) }); //? Meaning waitForElementToBeRemoved() w/ a "{timeout:5000}" option would be the only solution
      expect(screen.queryByRole("alert")).not.toBeInTheDocument() //? Which is flakey & limiting especially w/ Jest's default 5s per test time limit
      //? Instead, the only quirk is using act() w/ timerAdvance since it lets setTimeout async run a state update (App.js line 28 "setShowAlert")
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    }
    test("showing a danger alert if contact-me submit button fires without permission", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime }); //? VERY IMPORTANT due to setTimeout being used internally!
      jest.useFakeTimers(); //? OTHERWISE jest's fakeTimers will freeze userEvents entirely (like in line 58)
      jest.spyOn(CommonAPI, 'SendEmail').mockImplementation(() => '123'); //* Invalid response so Turnstile thinks user is a computer
      render(<App />);
      expect(ApiMock).toHaveBeenCalledTimes(1);

      await submitContactForm(user); //* Despite invalid user, trying to submit anyway fails behind the scenes

      const dangerAlert = await screen.findByRole("alert") //* Failing behind the scenes, the alert appears, providing feedback that email wasn't sent
      expect(dangerAlert).toHaveClass("alert-danger"); //* Correct color red on unsuccessful
      expect(screen.getByText(/email wasn't sent/i)).toBeInTheDocument(); //* Email not sent title
      expect(screen.getByText(/back up and running/i)).toBeInTheDocument(); //* Not working as expected message

      completeAlertTimeoutDismiss();
    })
    test("showing a success alert if contact-me submit button fires when expected", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime }); //? VERY IMPORTANT due to setTimeout being used internally!
      jest.useFakeTimers(); //? OTHERWISE jest's fakeTimers will freeze userEvents entirely
      jest.spyOn(CommonAPI, 'SendEmail').mockImplementation(() => { //* Must return a valid response for Turnstile to provide a success response
        return { success: true, "error-codes": [], "challenge_ts": "1:00pm", "message": "Successfully sent your email!" }
      });
      render(<App />);
      expect(ApiMock).toHaveBeenCalledTimes(1);

      await submitContactForm(user); //* User seems human so valid turnstile response received and email is sending

      const successAlert = await screen.findByRole("alert"); //* After submitting the alert appears, providing feedback that email sent successfully!
      expect(successAlert).toHaveClass("alert-success"); //* Correct color green on success
      expect(screen.getByText(/email sent/i)).toBeInTheDocument(); //* Email sent successfully title!
      expect(screen.getByText(/successfully sent/i)).toBeInTheDocument(); //* Successfully sent message

      completeAlertTimeoutDismiss();
    })
  })
})
