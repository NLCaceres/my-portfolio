import { vi, type MockInstance } from "vitest";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { Globals } from "@react-spring/web";
import { screen, render, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectFactory from "../Utility/TestHelpers/ProjectFactory";
import { mobileHighEndWidth, smallDesktopLowEndWidth } from "../Utility/Constants/Viewports";
import { RouteList } from "../Routing/RouteList";
import { type TurnstileWidgetProps } from "../ThirdParty/TurnstileWidget";
import { type UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import * as ViewWidthContext from "../ContextProviders/ViewWidthProvider";
import * as GetPostList from "../Data/Api/ProjectAPI";
import * as CommonAPI from "../Data/Api/Common";
import * as Scroll from "../Utility/Functions/Browser";

vi.mock("../ThirdParty/TurnstileWidget", () => {
  return {
    default: ({ successCB }: TurnstileWidgetProps) => {
      return (<div><button type="button" onClick={() => { successCB("123"); }}>Turnstile Verification Button</button></div>);
    }
  };
});

beforeAll(() => { // ?: Skip animating styles from Route Transitions, immediately finish their interpolation
  Globals.assign({ skipAnimation: true }); // ?: So tests run quick BUT props are updated as expected!

  // ?: Workaround for Vitest since Testing-Lib/UserEvent uses Jest timers by default,
  // ?: making the typical userEvent.setup({ advanceTimers: vi.advanceTimersByTime }) useless without the following
  // ?: This workaround is not required unless using userEvent, ex: TurnstileWidget or Browser tests
  // @ts-expect-error: Ignore setting Jest since no type is available without the package itself
  const _jest = globalThis.jest;

  // @ts-expect-error: Merge original Jest settings with Vitest as the timer
  globalThis.jest = {
    // @ts-expect-error: Assert Jest setting is in global
    ...globalThis.jest,
    advanceTimersByTime: vi.advanceTimersByTime.bind(vi)
  };

  // @ts-expect-error: Restore Testing-Lib's original Jest timer
  return () => void (globalThis.jest = _jest); // ?: Cleanup function to reset the global Jest
});

describe("renders the whole app", () => {
  let ApiMock: MockInstance;
  beforeEach(() => {
    const majProject = ProjectFactory.create(); const minProject = ProjectFactory.create();
    ApiMock = vi.spyOn(GetPostList, "default").mockResolvedValue({ majorProjects: [majProject], minorProjects: [minProject] });
  });
  afterEach(() => { vi.restoreAllMocks(); });
  describe("controls the opening of an app-wide alert element", () => {
    test("showing a danger alert if contact-me submit button fires without permission", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime }); // ?: VERY IMPORTANT due to setTimeout being used internally!
      vi.useFakeTimers(); // ?: OTHERWISE Vitest's fakeTimers will freeze userEvents entirely (like in line 58)
      vi.spyOn(CommonAPI, "SendEmail").mockResolvedValue("123"); // - Invalid response so Turnstile thinks user is a computer
      const router = createMemoryRouter(RouteList, { initialEntries: ["/portfolio/about-me"] });
      render(<RouterProvider router={router} />);
      expect(ApiMock).toHaveBeenCalledTimes(1);

      await submitContactForm(user); // - Despite invalid user, trying to submit anyway fails behind the scenes

      const dangerAlert = await screen.findByRole("alert"); // - Failing behind the scenes, the alert appears, providing feedback that email wasn't sent
      expect(dangerAlert).toHaveClass("alert-danger"); // - Correct color red on unsuccessful
      expect(screen.getByText(/email wasn't sent/i)).toBeInTheDocument(); // - Email not sent title
      expect(screen.getByText(/back up and running/i)).toBeInTheDocument(); // - Not working as expected message

      // ?: Need `act()` since advancing the time will cause App's setTimeout to run a state update aka `setShowAlert`
      await act(() => vi.advanceTimersByTime(5000));
      expect(screen.queryByText("alert")).not.toBeInTheDocument();
      vi.runOnlyPendingTimers();
      vi.useRealTimers();
    });
    test("showing a success alert if contact-me submit button fires when expected", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime }); // ?: VERY IMPORTANT due to setTimeout being used internally!
      vi.useFakeTimers(); // ?: OTHERWISE Vitest's fakeTimers will freeze userEvents entirely
      vi.spyOn(CommonAPI, "SendEmail").mockResolvedValue( // - Must return a valid response for Turnstile to provide a success response
        { success: true, "error-codes": [], "challenge_ts": "1:00pm", "message": "Successfully sent your email!" }
      );
      const router = createMemoryRouter(RouteList, { initialEntries: ["/portfolio/about-me"] });
      render(<RouterProvider router={router} />);
      expect(ApiMock).toHaveBeenCalledTimes(1);

      await submitContactForm(user); // - User seems human so valid turnstile response received and email is sending

      const successAlert = await screen.findByRole("alert"); // - After submitting the alert appears, providing feedback that email sent successfully!
      expect(successAlert).toHaveClass("alert-success"); // - Correct color green on success
      expect(screen.getByText(/email sent/i)).toBeInTheDocument(); // - Email sent successfully title!
      expect(screen.getByText(/successfully sent/i)).toBeInTheDocument(); // - Successfully sent message

      await act(() => vi.advanceTimersByTime(5000));
      expect(screen.queryByText("alert")).not.toBeInTheDocument();
      vi.runOnlyPendingTimers();
      vi.useRealTimers();
    });
    test("controls if the footer's contact me button opens a 'Contact Me' modal or navigates to '/contact-me'", async () => {
      const scrollSpy = vi.spyOn(Scroll, "SmoothScroll").mockImplementation(() => 1);
      const useViewWidthSpy = vi.spyOn(ViewWidthContext, "default").mockReturnValue(smallDesktopLowEndWidth);
      const user = userEvent.setup();
      const router = createMemoryRouter(RouteList, { initialEntries: ["/portfolio/about-me"] });
      const { unmount } = render(<RouterProvider router={router} />);
      // - This expect() checks the API responded & inserted stubbed PostCards into the DOM at "/portfolio/about-me"
      expect(ApiMock).toHaveBeenCalledTimes(1);

      const contactMeButton = await screen.findByRole("button", { name: /contact me/i });
      await user.click(contactMeButton); // - Should work as a button opening a modal
      const modal = screen.getByRole("dialog");
      expect(modal).toBeInTheDocument();
      expect(scrollSpy).not.toHaveBeenCalled(); // - No scroll needed, just open the modal

      const modalCloser = screen.getByLabelText(/close/i); // - Close the modal now
      await user.click(modalCloser);
      expect(modal).toHaveAttribute("aria-hidden", "true"); // - Invisible to screen readers via "aria-hidden"
      expect(modal).toBeInTheDocument(); // - BUT it is still in the document body
      unmount();

      useViewWidthSpy.mockReturnValue(mobileHighEndWidth); // - Rerender as mobile version
      render(<RouterProvider router={router} />);
      const contactMeButtonLink = await screen.findByRole("button", { name: /contact me/i });
      await user.click(contactMeButtonLink); // - Now at large mobile width, so should work as a link, navigating to "/contact-me"
      // ?: W/out location prop on <Routes>, <Routes> updates B4 leaving MEANWHILE a duplicate is entering so have to wait for original to leave
      await waitFor(() => { expect(screen.getAllByRole("heading", { name: /contact me!/i, level: 1 })).toHaveLength(1); });
      expect(screen.getByRole("heading", { name: /contact me!/i, level: 1 })).toBeInTheDocument(); // ?: Now only have one "Contact Me!"
      expect(scrollSpy).toHaveBeenCalledTimes(1); // - Smooth scroll occurs on route transition, NOT modal opening
    });
  });
});

// !: Helper Functions
async function submitContactForm(user: UserEvent) { // - Provide a reusable way of firing the contact form
  const contactMeButton = screen.getByRole("button", { name: /contact me/i });
  await user.click(contactMeButton); // - Open Contact Form Modal
  const modal = screen.getByRole("dialog");
  expect(modal).toBeInTheDocument();

  const emailInput = screen.getByLabelText("Email Address"); // - Input email address into form
  await user.type(emailInput, "someEmail@example.com");
  expect(emailInput).toHaveValue("someEmail@example.com");

  const messageInput = screen.getByLabelText("Message"); // - Input email message body into form
  await user.type(messageInput, "Hello World!");
  expect(messageInput).toHaveValue("Hello World!");

  await user.click(screen.getByRole("button", { name: /turnstile verification button/i })); // - Verify user is human

  const contactButtons = screen.getAllByRole("button", { name: /contact me/i }); // - Find the modal form's submit button
  const correctContactButton = (contactButtons[0].className === "submitButton btn btn-primary") ? contactButtons[0] : contactButtons[1];
  await user.click(correctContactButton); // - Click the actual submit button (not the button used to open the modal)
}
