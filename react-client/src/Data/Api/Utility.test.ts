import GetData, { PostData } from "./Utility";
import { vi, type MockInstance, type Mock } from "vitest";
import * as BrowserFuncs from "../../Utility/Functions/Browser";

const createMockResponse = <T>(jsonResponse: T, statusCode = 200) =>
  vi.fn(() => Promise.resolve({ json: () => Promise.resolve(jsonResponse), status: statusCode })) as Mock;
//? Why use createMockResponse() to mock the global Fetch API's entire implementation?
//? Because just using mockResolvedValue allows real requests to still be sent
describe("should create simple and useful", () => {
  let fetchSpy: MockInstance;
  beforeEach(() => { //* mockImplementation return value must include json key or function throws, failing the test
    fetchSpy = vi.spyOn(global, "fetch").mockImplementation(createMockResponse([]));
  });
  afterEach(() => { fetchSpy.mockRestore(); }); //* Reset mocks

  describe("GET requests", () => {
    test("should call FETCH with the correct basic headers", async () => {
      const commonHeaders = { headers: { "Accept": "application/json" } };
      await GetData("/some-url"); //* Return value unnecessary for this test
      expect(fetchSpy).lastCalledWith("/some-url", commonHeaders);

      await GetData("/some-other-url");
      expect(fetchSpy).lastCalledWith("/some-other-url", commonHeaders);
    });
    test("should use invalid status codes from response to cause an early return", async () => {
      fetchSpy.mockImplementationOnce(createMockResponse({ body: [] }, 200));
      const emptyResponse = await GetData("/some-url"); //* Basic 200 status without any values sent back yields
      expect(emptyResponse).toStrictEqual({ body: [] }); //* Simple empty object w/ expected JSON keys

      fetchSpy.mockImplementationOnce(createMockResponse({ body: [] }, 400));
      const badResponse = await GetData("/some-other-url");
      expect(badResponse).toBe(undefined); //* 400 status or higher yields undefined
    });
  });

  describe("POST requests", () => {
    test("using our data and some CSRF token to post the data", async () => {
      const GetCookieSpy = vi.spyOn(BrowserFuncs, "GetCookie").mockImplementationOnce(() => "some-token");
      const body = { didSucceed: false };
      await PostData("/some-url", body);

      expect(GetCookieSpy).toHaveBeenCalledTimes(1);
      expect(GetCookieSpy).lastCalledWith("CSRF-TOKEN");

      const requestOptions = { method: "POST", headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": "some-token" }, body: "{\"didSucceed\":false}" };
      expect(fetchSpy).lastCalledWith("/some-url", requestOptions);

      GetCookieSpy.mockRestore();
    });
    test("early returns if invalid status code or returns the body in JSON form if valid status code", async () => { //*
      const badResponse = new Response("foobar", { status: 400 }); //* IF 400 or above status code
      fetchSpy.mockImplementationOnce(() => badResponse);
      const badJsonResponse = await PostData("hello");
      expect(badJsonResponse).toBe(undefined); //* THEN will receive undefined return

      fetchSpy.mockImplementationOnce(() => ({ json: () => "Success" })); //* Missing status!
      const invalidResponse = await PostData("hello");
      expect(invalidResponse).toBe(undefined);

      fetchSpy.mockImplementationOnce(createMockResponse("Success"));
      const jsonResponse = await PostData("hello"); //* Valid status
      expect(jsonResponse).toBe("Success"); //* THEN return json response
    });
  });
});