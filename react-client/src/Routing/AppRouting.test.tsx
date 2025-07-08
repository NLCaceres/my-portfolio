import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
//import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { Globals } from "@react-spring/web";
import ProjectFactory from "../Utility/TestHelpers/ProjectFactory";
import { TanStackRouter } from "./RouteList";
import { RouterProvider } from "@tanstack/react-router";
import * as GetPostList from "../Data/Api/ProjectAPI";

//* No click needed on this mock Widget, so keep it simple
vi.mock("../ThirdParty/TurnstileWidget", () => {
  return { default: () => <div>Turnstile Verification Button</div> };
});

beforeAll(() => { //? Skip Route Transition style animations, instant finish, no interpolating
  Globals.assign({ skipAnimation: true }); //? So tests run quick BUT props updated as expected!
});

describe("renders react-router-dom routes", () => {
  beforeEach(() => {
    const majProject = ProjectFactory.create(); const minProject = ProjectFactory.create();
    vi.spyOn(GetPostList, "default")
      .mockResolvedValue({ majorProjects: [majProject], minorProjects: [minProject] });
  });
  afterEach(() => { vi.restoreAllMocks(); });

  test("mapping a home page to '/' and '/portfolio/about-me'", async () => {
    //const baseRouter = createMemoryRouter(RouteList, { initialEntries: ["/"] });
    render(<RouterProvider router={TanStackRouter} />);
    await screen.findByText(/about me/i); //* Await placeholders fading for major/minor projects to render in

    await waitFor(() => TanStackRouter.navigate({
      to: "/portfolio/$postId", params: { postId: "about-me" }
    }));
    await screen.findByText(/about me/i); //* Should directly route to about me page

    await waitFor(() => TanStackRouter.navigate({ to: "/" }));
    await screen.findByText(/about me/i); //* THIS WILL NOT MATCH. It needs /portfolio prefix. Will get redirect instead

    await waitFor(() => TanStackRouter.navigate({ to: "/portfolio" }));
    await screen.findByText(/about me/i);

    await waitFor(() => TanStackRouter.navigate({ href: "/about-me" }));
    await screen.findByText(/Sorry/);
  });

  test("mapping out four main portfolio routes", async () => { //! iOS, Android, Front-End, Back-End
    //const portfolioAboutMeRouter = createMemoryRouter(RouteList, { initialEntries: ["/portfolio/android"] });
    await waitFor(() => TanStackRouter.navigate({
      to: "/portfolio/$postId", params: { postId: "android" }
    }));
    render(<RouterProvider router={TanStackRouter} />);
    await screen.findByRole("heading", { name: /Android/, level: 1 }); //* Should display Android in title header

    await waitFor(() => TanStackRouter.navigate({
      to: "/portfolio/$postId", params: { postId: "front-end" }
    }));
    await screen.findByRole("heading", { name: /Front-End/, level: 1 }); //* Should display Front-End in title header

    await waitFor(() => TanStackRouter.navigate({
      to: "/portfolio/$postId", params: { postId: "back-end" }
    }));
    await screen.findByRole("heading", { name: /Back-End/, level: 1 }); //* Should display Back-End in title header

    await waitFor(() => TanStackRouter.navigate({
      to: "/portfolio/$postId", params: { postId: "iOS" }
    }));
    await screen.findByRole("heading", { name: /iOS/, level: 1 }); //* Should display iOS in title header

    await waitFor(() => TanStackRouter.navigate({
      to: "/portfolio/$postId", params: { postId: "ANDROID" }
    }));
    await screen.findByRole("heading", { name: /ANDROID/, level: 1 }); //* Should display Android in title header

    await waitFor(() => TanStackRouter.navigate({ href: "/iOS" }));
    await screen.findByText(/Sorry/); //* THIS WILL NOT MATCH. It needs /portfolio prefix. Just get redirect

    vi.spyOn(GetPostList, "default") // Empty minor projects needed or finds multiple "Nicholas"
      .mockResolvedValue({ majorProjects: [ProjectFactory.create()], minorProjects: [] });
    await waitFor(() => // WHEN the URL param is empty, i.e. "/portfolio/"
      TanStackRouter.navigate({ to: "/portfolio/$postId", params: { postId: "" } })
    );
    // THEN redirect to "About Me"
    await screen.findByRole("heading", { name: "About Me" });
    expect(screen.getByRole("heading", { name: /nicholas/i }));

    await waitFor(() => TanStackRouter.navigate({ href: "/portfolio/foobar/barfoo" }));
    expect(await screen.findByText("Sorry! Not Much to See Here!")).toBeInTheDocument();
  });

  test("mapping a contact me page", async () => {
    //const contactMeRouter = createMemoryRouter(RouteList, { initialEntries: ["/contact-me"] });
    await waitFor(() => TanStackRouter.navigate({ to: "/contact-me" }));
    render(<RouterProvider router={TanStackRouter} />);
    await screen.findByText(/Contact Me!/);

    await waitFor(() => TanStackRouter.navigate({ href: "/portfolio/contact-me" }));
    await screen.findByText(/Sorry/); //* Portfolio prefix not needed. Will redirect to not found page
  });

  test("mapping a fallback route to a not found page", async () => {
    //const fallbackRouter = createMemoryRouter(RouteList, { initialEntries: ["/foobar"] });
    await waitFor(() => TanStackRouter.navigate({ href: "/foobar" }));
    render(<RouterProvider router={TanStackRouter} />);
    await screen.findByText(/Sorry/); //* Should redirect to not found page

    await waitFor(() => TanStackRouter.navigate({ to: "/not-found" }));
    await screen.findByText(/Sorry/); //* Goes straight to not found page
  });
});
