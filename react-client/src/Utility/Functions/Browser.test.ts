import { GetCookie, SmoothScroll } from "./Browser";
import { vi } from "vitest";

describe("provides common functions used by the browser ", () => {

  describe("getting cookies from browser", () => {
    // TODO: May need a delete cookie option for tests since they can lead to test pollution
    test("handling when there are no cookies and getting specific cookies otherwise", () => {
      // - WHEN there are no cookies, the cookies string/split array is simply empty, contains only a single empty string
      const emptyCookie = GetCookie("the-cookie-is-a-lie");
      expect(emptyCookie).toBe(undefined); // - THEN return undefined

      document.cookie = "name=foobar;";
      document.cookie = "title=barfoo;";
      // - WHEN the desired cookie does not exist
      const missingCookie = GetCookie("the-cookie-is-a-lie");
      expect(missingCookie).toBe(undefined); // - THEN return undefined

      document.cookie = "CSRF-TOKEN=some-token;";
      // - WHEN the desired cookie exists in the document cookies string
      const token = GetCookie("CSRF-TOKEN");
      expect(token).toBe("some-token"); // - THEN return the desired cookie's value alone
    });
  });

  test("running a scroll to the top on 350 millisecond timeout", () => {
    vi.useFakeTimers();
    const scrollSpy = vi.spyOn(window, "scroll").mockImplementation(() => 1);

    SmoothScroll();

    vi.advanceTimersByTime(350);
    expect(scrollSpy).toHaveBeenCalledTimes(1);
    expect(scrollSpy).toHaveBeenLastCalledWith({ top: 0, left: 0, behavior: "smooth" });

    vi.useRealTimers();
  });
});