import { GetCookie, SmoothScroll } from "./Browser";

describe("provides common functions used by the browser ", () => {

  describe("getting cookies from browser", () => {
    //todo May need a delete cookie option for tests since they can lead to test pollution
    test("handling when there are no cookies and getting specific cookies otherwise", () => {
      const emptyCookie = GetCookie("the-cookie-is-a-lie");
      expect(emptyCookie).toBe(undefined);

      document.cookie = "name=foobar;";
      document.cookie = "title=barfoo;";
      const missingCookie = GetCookie("the-cookie-is-a-lie");
      expect(missingCookie).toBe(undefined);

      document.cookie = "CSRF-TOKEN=some-token;";
      const token = GetCookie("CSRF-TOKEN");
      expect(token).toBe("some-token");
    });
  });

  test("running a scroll to the top on 350 millisecond timeout", () => {
    jest.useFakeTimers();
    const scrollSpy = jest.spyOn(window, "scroll").mockImplementation(() => 1);

    SmoothScroll();

    jest.advanceTimersByTime(350);
    expect(scrollSpy).toHaveBeenCalledTimes(1);
    expect(scrollSpy).toHaveBeenLastCalledWith({ top: 0, left: 0, behavior: "smooth" });

    jest.useRealTimers();
  });
});