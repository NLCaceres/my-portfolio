import React from "React";
import AppRouting from "./AppRouting";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Globals } from "@react-spring/web";
import ProjectFactory from "../Utility/Functions/Tests/ProjectFactory";
import * as GetPostList from "../Api/ProjectAPI";

jest.mock("../Utility/Components/TurnstileWidget", () => ({action, successCB, className }) => {
  return (<div><button type="button" onClick={() => { successCB("123") }}>Turnstile Verification Button</button></div>);
})

beforeAll(() => { //? Skip animating styles from Route Transitions, immediately finish their interpolation
  Globals.assign({ skipAnimation: true }); //? So tests run quick BUT props are updated as expected!
})

describe("renders react-router-dom routes", () => {
  beforeEach(() => {
    const majProject = ProjectFactory.create(); const minProject = ProjectFactory.create();
    jest.spyOn(GetPostList, "default").mockImplementation(() => ({ majorProjects: [majProject], minorProjects: [minProject] }) );
  })
  afterEach(() => { jest.restoreAllMocks() })
  
  test("mapping a home page to '/' and '/portfolio/about-me'", async () => {
    //? Redirects seem to cause trouble when paired with React-Spring's useTransitions BUT by using my own key selection func +
    //? not passing <Routes /> a location prop, I can avoid headaches in tests AND production (See AppRouting.js line 13 & 23)
    const { unmount } = render(<MemoryRouter initialEntries={["/"]}> <AppRouting /> </MemoryRouter>);
    await screen.findByText(/about me/i); //* Allow placeholders to fade out and major/minor projects to render in
    unmount(); //* Must unmount to induce history changes in MemoryRouter during testing

    const { unmount: unmountAboutMe } = render(<MemoryRouter initialEntries={["/portfolio/about-me"]}> <AppRouting /> </MemoryRouter>);
    await screen.findByText(/about me/i); //* Should directly route to about me page
    unmountAboutMe();

    render(<MemoryRouter initialEntries={["/about-me"]}> <AppRouting /> </MemoryRouter>);
    await screen.findByText(/Sorry/); //* THIS WILL NOT MATCH. It needs /portfolio prefix. Will get redirect instead
  })

  test("mapping out four main portfolio routes", async () => { //! iOS, Android, Front-End, Back-End
    const { unmount: unmountAndroid } = render(<MemoryRouter initialEntries={["/portfolio/android"]}> <AppRouting /> </MemoryRouter>);
    await screen.findByText(/Android/); //* Should display Android in title header
    unmountAndroid();

    const { unmount: unmountFrontend } = render(<MemoryRouter initialEntries={["/portfolio/front-end"]}> <AppRouting /> </MemoryRouter>);
    await screen.findByText(/Front-End/); //* Should display Front-End in title header
    unmountFrontend();

    const { unmount: unmountBackend } = render(<MemoryRouter initialEntries={["/portfolio/back-end"]}> <AppRouting /> </MemoryRouter>);
    await screen.findByText(/Back-End/); //* Should display Back-End in title header
    unmountBackend();

    const { unmount: unmountIOS } = render(<MemoryRouter initialEntries={["/portfolio/iOS"]}> <AppRouting /> </MemoryRouter>);
    await screen.findByText(/iOS/); //* Should display iOS in title header
    unmountIOS();

    render(<MemoryRouter initialEntries={["/iOS"]}> <AppRouting /> </MemoryRouter>);
    await screen.findByText(/Sorry/); //* THIS WILL NOT MATCH. It needs /portfolio prefix. Just get redirect
  })

  test("mapping a contact me page", async () => {
    const { unmount: unmountContactMe } = render(<MemoryRouter initialEntries={["/contact-me"]}> <AppRouting /> </MemoryRouter>);
    await screen.findByText(/Contact Me!/); //* Actual contact me page, not just the modal
    unmountContactMe();

    render(<MemoryRouter initialEntries={["/portfolio/contact-me"]}> <AppRouting /> </MemoryRouter>);
    await screen.findByText(/Sorry/); //* Portfolio prefix not needed. Will redirect to not found page
  })

  test("mapping a fallback route to a not found page", async () => {
    const { unmount: unmountRedirect } = render(<MemoryRouter initialEntries={["/foobar"]}> <AppRouting /> </MemoryRouter>);
    await screen.findByText(/Sorry/); //* Should redirect to not found page
    unmountRedirect();

    render(<MemoryRouter initialEntries={["/not-found"]}> <AppRouting /> </MemoryRouter>);
    await screen.findByText(/Sorry/); //* Goes straight to not found page
  })
})