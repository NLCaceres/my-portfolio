import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { type TurnstileWidgetProps } from "../ThirdParty/TurnstileWidget";

//* Unfortunately, jest.doMock() nor jest.isolateModules() seem to work as expected 
//* Using jest.doMock() doesn't re-mock between tests BUT jest.resetModules() crashes tests making it useless
//* jest.isolateModules() on the other hand seems to have trouble being used twice as well as 
//* seems to have trouble w/ async methods like findByRole or user.click()
//* Using isolateModules: Can't contain outside scope, so a new mock must be made each time
//* Using jest.doMock: Requires using "await import("someDir/someFile")" in each test BUT then they hang if you have to "await" another func
//todo Maybe Jest 29 will fix it because 'jest.spyOn().mock(() => () => { return mockTurnstileWidget })' doesn't work either
vi.mock("../ThirdParty/TurnstileWidget", () => {
  return {
    default: ({ successCB }: TurnstileWidgetProps) => {
      return (<div><button type="button" onClick={() => { successCB(undefined) }}>Turnstile Verification Button</button></div>);
    }
  }
});

describe("renders the form for the contact page", () => {
  describe("that depends on '_CONTACTABLE' env var for conditionally rendering", () => {
    test("a try again state in the submit button if bot detected trying to submit", async () => {
      const user = userEvent.setup();
      const ContactPageFormImport = await import("./ContactPageForm");
      const ContactPageForm = ContactPageFormImport.default;
      render(<ContactPageForm />);

      expect(screen.queryByRole("button", { name: /checking you're human!/i })).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: /turnstile verification button/i }));

      expect(screen.queryByRole("button", { name: /try again later/i })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /checking you're human!/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /currently unavailable/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /contact me/i })).not.toBeInTheDocument();
    })
  });
});