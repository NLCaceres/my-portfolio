import React from "react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { screen, render, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectFactory from "../Utility/Functions/Tests/ProjectFactory";
import * as GetPostList from "../Api/ProjectAPI";
import { mobileHighEndWidth } from "../Utility/Constants/Viewports";

jest.mock("../Utility/Components/TurnstileWidget", () => ({action, successCB, className }) => {
  return (<div><button type="button" onClick={() => { successCB("123") }}>Turnstile Verification Button</button></div>);
})

describe("renders the whole app", () => {
  let ApiMock;
  beforeEach(() => {
    const majProject = ProjectFactory.create(); const minProject = ProjectFactory.create();
    ApiMock = jest.spyOn(GetPostList, "default").mockImplementation(() => ({ majorProjects: [majProject], minorProjects: [minProject] }) );
  })
  afterEach(() => { jest.restoreAllMocks() })
  test("controls the opening of a 'Contact Me' modal or navigation to '/contact-me' onClick of the footer's contact me button", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />, { wrapper: BrowserRouter });
    //* Following ensures stubs have been inserted into DOM at '/portfolio/about-me'
    expect(ApiMock).toHaveBeenCalledTimes(1);

    const contactMeButton = await screen.findByRole("button", { name: /contact me/i });
    await user.click(contactMeButton); //* Should work as a button opening a modal
    const modal = screen.getByRole("dialog");
    expect(modal).toBeInTheDocument();

    const modalCloser = screen.getByLabelText("Close");
    await user.click(modalCloser);
    await waitForElementToBeRemoved(modalCloser);
    expect(modal).not.toBeInTheDocument();

    unmount(); //* Need to retrigger onMount useEffect set(window.innerWidth)

    //? Following works to let viewWidth conditional navigation run from App's contactButtonClicked()
    //? BUT it kills 'App.test.js' other two tests, specifically anything async/await like expect(), user.click(), etc.
    //? So not really sure anything else would work to test "innerWidth" in App aside from this, separating the files
    //? Other components can have width easily inserted via prop
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: mobileHighEndWidth });
    render(<App />, { wrapper: BrowserRouter });
    const contactMeButtonLink = await screen.findByRole("button", { name: /contact me/i });
    await user.click(contactMeButtonLink); //* Now should work as a link, moving to "/contact-me"
    expect(screen.getByRole("heading", { name: /contact me/i, level: 1 })).toBeInTheDocument();

    window.innerWidth = 1024 //* Reset to default Jest width
  });
});