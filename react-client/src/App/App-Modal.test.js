import React from "react";
import App from "./App";
import { MemoryRouter } from "react-router-dom";
import { Globals } from "@react-spring/web";
import { screen, render, waitForElementToBeRemoved, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectFactory from "../Utility/TestHelpers/ProjectFactory";
import { mobileHighEndWidth } from "../Utility/Constants/Viewports";
import * as GetPostList from "../Api/ProjectAPI";
import * as Scroll from "../Utility/Functions/Browser";

jest.mock("../ThirdParty/TurnstileWidget", () => ({action, successCB, className }) => {
  return (<div><button type="button" onClick={() => { successCB("123") }}>Turnstile Verification Button</button></div>);
})

beforeAll(() => { //? Skip animating styles from Route Transitions, immediately finish their interpolation
  Globals.assign({ skipAnimation: true }); //? So tests run quick BUT props are updated as expected!
})

describe("renders the whole app", () => {
  let ApiMock;
  beforeEach(() => {
    const majProject = ProjectFactory.create(); const minProject = ProjectFactory.create();
    ApiMock = jest.spyOn(GetPostList, "default").mockImplementation(() => ({ majorProjects: [majProject], minorProjects: [minProject] }) );
  })
  afterEach(() => { jest.restoreAllMocks() })
  test("controls the opening of a 'Contact Me' modal or navigation to '/contact-me' onClick of the footer's contact me button", async () => {
    const scrollSpy = jest.spyOn(Scroll, "SmoothScroll");
    const user = userEvent.setup();
    const { unmount } = render(<MemoryRouter initialEntries={["/portfolio/about-me"]}> <App /> </MemoryRouter>);
    //* Following ensures stubs have been inserted into DOM at '/portfolio/about-me'
    expect(ApiMock).toHaveBeenCalledTimes(1);

    const contactMeButton = await screen.findByRole("button", { name: /contact me/i });
    await user.click(contactMeButton); //* Should work as a button opening a modal
    const modal = screen.getByRole("dialog");
    expect(modal).toBeInTheDocument();
    expect(scrollSpy).not.toHaveBeenCalled(); //* No scroll needed, just open the modal

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
    render(<MemoryRouter initialEntries={["/portfolio/about-me"]}> <App /> </MemoryRouter>);
    const contactMeButtonLink = await screen.findByRole("button", { name: /contact me/i });
    await user.click(contactMeButtonLink); //* Now should work as a link, moving to "/contact-me"
    //? Without location prop applied to <Routes>, <Routes> updates BEFORE it leaves all while a duplicate is entering
    await waitFor(() => { expect(screen.getAllByRole("heading", { name: /contact me!/i, level: 1 })).toHaveLength(1) }) //? So must wait for original to leave
    expect(screen.getByRole("heading", { name: /contact me!/i, level: 1 })).toBeInTheDocument(); //? Now only have one "Contact Me!"
    expect(scrollSpy).toHaveBeenCalledTimes(1); //* Smooth scroll occurs on route transition, NOT modal opening

    window.innerWidth = 1024 //* Reset to default Jest width
  });
});