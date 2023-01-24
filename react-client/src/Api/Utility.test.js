import GetData, { PostData } from "./Utility";
import * as BrowserFuncs from "../Utility/Functions/Browser";

describe("should create simple and useful", () => {
  let fetchSpy;
  beforeEach(() => { //* mockImplementation return value must include json key or function throws, failing the test
    fetchSpy = jest.spyOn(global, "fetch").mockImplementation(() => ({ status: 200, json: () => [] }));
  })
  afterEach(() => { fetchSpy.mockRestore() }) //* Reset mocks
  
  describe("GET requests", () => {
    test("should call FETCH with the correct basic headers", async () => {
      const commonHeaders = { headers: { "Accept": "application/json" } };
      await GetData("/some-url"); //* Return value unnecessary for this test
      expect(fetchSpy).lastCalledWith("/some-url", commonHeaders);
  
      await GetData("/some-other-url");
      expect(fetchSpy).lastCalledWith("/some-other-url", commonHeaders);
    })
    test("should use invalid status codes from response to cause an early return", async () => {
      fetchSpy.mockImplementationOnce(() => ({ status: 200, json: () => ({ body: [] }) }));
      const emptyResponse = await GetData('/some-url'); //* Basic 200 status without any values sent back yields
      expect(emptyResponse).toStrictEqual({ body: [] }); //* Simple empty object w/ expected JSON keys
  
      fetchSpy.mockImplementationOnce(() => ({ status: 400 }));
      const badResponse = await GetData("/some-other-url");
      expect(badResponse).toBe(undefined); //* 400 status or higher yields undefined
    })
  })

  describe("POST requests", () => {
    test("using our data and some CSRF token to post the data", async () => {
      const GetCookieSpy = jest.spyOn(BrowserFuncs, "GetCookie").mockImplementationOnce(() => "some-token");
      const body = { didSucceed: false };
      await PostData("/some-url", body);
      
      expect(GetCookieSpy).toHaveBeenCalledTimes(1);
      expect(GetCookieSpy).lastCalledWith("CSRF-TOKEN");

      const requestOptions = { method: "POST", headers: { "Content-Type": "application/json", "X-CSRF-Token": "some-token" }, body: "{\"didSucceed\":false}" };
      expect(fetchSpy).lastCalledWith("/some-url", requestOptions);

      GetCookieSpy.mockRestore();
    })
    test("early returns if invalid status code or returns the body in JSON form if valid status code", async () => { //* 
      const badResponse = new Response("foobar", { status: 400 }) //* IF 400 or above status code
      fetchSpy.mockImplementationOnce(() => badResponse);
      const badJsonResponse = await PostData("hello");
      expect(badJsonResponse).toBe(undefined); //* THEN will receive undefined return
  
      fetchSpy.mockImplementationOnce(() => ({ json: () => 'Success' })); //* Missing status!
      const invalidResponse = await PostData("hello");
      expect(invalidResponse).toBe(undefined);
  
      fetchSpy.mockImplementationOnce(() => ({ json: () => 'Success', status: 200 }));
      const jsonResponse = await PostData("hello"); //* Valid status 
      expect(jsonResponse).toBe('Success'); //* THEN return json response
    })
  })
})