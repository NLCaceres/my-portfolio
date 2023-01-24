import React from 'react';
import App from './App';
import { screen, prettyDOM, render, act } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import ProjectFactory from '../Utility/Functions/Tests/ProjectFactory';
import * as GetPostList from '../Api/ProjectAPI';
import * as CommonAPI from "../Api/Common"

jest.mock("../Utility/Components/TurnstileWidget", () => ({action, successCB, className }) => {
  return (<div><button type="button" onClick={() => { successCB("123") }}>Dummy Node</button></div>);
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
    expect(modal).not.toBeInTheDocument();
  });
  describe("controls the opening of an app-wide alert element", () => {
    test("should show a danger alert if contact-me submit button fires without permission", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime }); //? VERY IMPORTANT due to setTimeout being used internally!
      jest.useFakeTimers(); //? OTHERWISE jest's fakeTimers will freeze userEvents entirely (See line 61)
      jest.spyOn(CommonAPI, 'SendEmail').mockImplementation(() => '123');
      render(<App />);
      expect(ApiMock).toHaveBeenCalledTimes(1);

      const contactMeButton = screen.getByRole('button', { name: /contact me/i });
      await user.click(contactMeButton);
      const modal = screen.getByRole("dialog");
      expect(modal).toBeInTheDocument();

      const emailInput = screen.getByLabelText("Email Address");
      await user.type(emailInput, "someEmail@example.com");
      expect(emailInput).toHaveValue("someEmail@example.com");

      const messageInput = screen.getByLabelText("Message");
      await user.type(messageInput, "Hello World!");
      expect(messageInput).toHaveValue("Hello World!");

      await user.click(screen.getByRole('button', { name: /dummy node/i }));

      const contactButtons = screen.getAllByRole('button', { name: /contact me/i });
      const correctContactButton = (contactButtons[0].className === 'submitButton btn btn-primary') ? contactButtons[0] : contactButtons[1];
      await user.click(correctContactButton);
      expect(screen.getByRole("alert")).toBeInTheDocument();
      //? Even if jest.useFakeTimers() was called here, line 59 "user.click" OR App's "setShowAlert" seemed to freeze the test, failing it
      act(() => { jest.advanceTimersByTime(6000) }); //? Meaning waitForElementToBeRemoved() w/ a "{timeout:5000}" option would be the only solution
      expect(screen.queryByRole("alert")).not.toBeInTheDocument() //? Which is flakey & limiting especially w/ Jest's default 5s per test time limit
      //? Instead, the only quirk is using act() w/ timerAdvance since it lets setTimeout async run a state update (App.js line 28 "setShowAlert")
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    })
  })
})
