import { GetCookie } from "./Browser";

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
    })
  })
});