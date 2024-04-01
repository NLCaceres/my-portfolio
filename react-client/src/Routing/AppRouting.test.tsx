import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { Globals } from "@react-spring/web";
import ProjectFactory from "../Utility/TestHelpers/ProjectFactory";
import { RouteList } from "./RouteList";
import * as GetPostList from "../Data/Api/ProjectAPI";

//* No click needed on this mock Widget, so keep it simple
vi.mock("../ThirdParty/TurnstileWidget", () => {
  return {
    default: () => (<div>Turnstile Verification Button</div>)
  }
});

beforeAll(() => { //? Skip animating styles from Route Transitions, immediately finish their interpolation
  Globals.assign({ skipAnimation: true }); //? So tests run quick BUT props are updated as expected!
})

describe("renders react-router-dom routes", () => {
  beforeEach(() => {
    const majProject = ProjectFactory.create(); const minProject = ProjectFactory.create();
    vi.spyOn(GetPostList, "default").mockResolvedValue({ majorProjects: [majProject], minorProjects: [minProject] });
  })
  afterEach(() => { vi.restoreAllMocks() })
  
  test("mapping a home page to '/' and '/portfolio/about-me'", async () => {
    //? Redirects seem to cause trouble when paired with React-Spring's useTransitions BUT by using my own key selection func +
    //? not passing <Routes /> a location prop, I can avoid headaches in tests AND production (See AppRouting.js line 13 & 23)
    const baseRouter = createMemoryRouter(RouteList, { initialEntries: ["/"] });
    const { unmount } = render(<RouterProvider router={baseRouter} />);
    await screen.findByText(/about me/i); //* Allow placeholders to fade out and major/minor projects to render in
    unmount(); //* Must unmount to induce history changes in MemoryRouter during testing

    const portfolioAboutMeRouter = createMemoryRouter(RouteList, { initialEntries: ["/portfolio/about-me"] });
    const { unmount: unmountAboutMe } = render(<RouterProvider router={portfolioAboutMeRouter} />);
    await screen.findByText(/about me/i); //* Should directly route to about me page
    unmountAboutMe();

    const aboutMeRouter = createMemoryRouter(RouteList, { initialEntries: ["/about-me"] });
    render(<RouterProvider router={aboutMeRouter} />);
    await screen.findByText(/Sorry/); //* THIS WILL NOT MATCH. It needs /portfolio prefix. Will get redirect instead
  })

  test("mapping out four main portfolio routes", async () => { //! iOS, Android, Front-End, Back-End
    const portfolioAboutMeRouter = createMemoryRouter(RouteList, { initialEntries: ["/portfolio/android"] });
    const { unmount: unmountAndroid } = render(<RouterProvider router={portfolioAboutMeRouter} />);
    await screen.findByText(/Android/); //* Should display Android in title header
    unmountAndroid();

    const portfolioFrontendRouter = createMemoryRouter(RouteList, { initialEntries: ["/portfolio/front-end"] });
    const { unmount: unmountFrontend } = render(<RouterProvider router={portfolioFrontendRouter} />);
    await screen.findByText(/Front-End/); //* Should display Front-End in title header
    unmountFrontend();

    const portfolioBackendRouter = createMemoryRouter(RouteList, { initialEntries: ["/portfolio/back-end"] });
    const { unmount: unmountBackend } = render(<RouterProvider router={portfolioBackendRouter} />);
    await screen.findByText(/Back-End/); //* Should display Back-End in title header
    unmountBackend();

    const portfolioiOSRouter = createMemoryRouter(RouteList, { initialEntries: ["/portfolio/iOS"] });
    const { unmount: unmountIOS } = render(<RouterProvider router={portfolioiOSRouter} />);
    await screen.findByText(/iOS/); //* Should display iOS in title header
    unmountIOS();

    const iOSRouter = createMemoryRouter(RouteList, { initialEntries: ["/iOS"] });
    render(<RouterProvider router={iOSRouter} />);
    await screen.findByText(/Sorry/); //* THIS WILL NOT MATCH. It needs /portfolio prefix. Just get redirect
  })

  test("mapping a contact me page", async () => {
    const contactMeRouter = createMemoryRouter(RouteList, { initialEntries: ["/contact-me"] });
    const { unmount: unmountContactMe } = render(<RouterProvider router={contactMeRouter} />);
    await screen.findByText(/Contact Me!/); //* Actual contact me page, not just the modal
    unmountContactMe();

    const portfolioContactMeRouter = createMemoryRouter(RouteList, { initialEntries: ["/portfolio/contact-me"] });
    render(<RouterProvider router={portfolioContactMeRouter} />);
    await screen.findByText(/Sorry/); //* Portfolio prefix not needed. Will redirect to not found page
  })

  test("mapping a fallback route to a not found page", async () => {
    const fallbackRouter = createMemoryRouter(RouteList, { initialEntries: ["/foobar"] });
    const { unmount: unmountRedirect } = render(<RouterProvider router={fallbackRouter} />);
    await screen.findByText(/Sorry/); //* Should redirect to not found page
    unmountRedirect();

    const notFoundRouter = createMemoryRouter(RouteList, { initialEntries: ["/not-found"] });
    render(<RouterProvider router={notFoundRouter} />);
    await screen.findByText(/Sorry/); //* Goes straight to not found page
  })
})