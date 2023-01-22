import GetPostList, { GetCsrfCookie, ProcessTurnstileResponse, postData } from "./Api";

//todo Refactor & create an API directory so related routes are grouped into each a file, making spies/mocks easier + more testable

const originalEnv = process.env;

describe("provides functions to reach out to Rails backend and 3rd party APIs like Cloudflare", () => {
  test("gets CSRF token cookie", () => { //todo GetCsrfCookie can be refactored into its own API util functions file
    document.cookie = "name=foobar;";
    document.cookie = "CSRF-TOKEN=some-token;";
    document.cookie = "title=barfoo;";
    const token = GetCsrfCookie();
    expect(token).toBe("some-token");
  })

  describe("sending a GET request to receive Post list", () => { //todo Refactor split into a generic GET request + the actual fetch Post list logic
    let fetchSpy;
    beforeEach(() => {
      fetchSpy = jest.spyOn(global, "fetch").mockImplementation(() => ({ status: 200, json: () => [] }));
    })
    afterEach(() => {
      fetchSpy.mockRestore();
    })
    test("query argument affects request url", async () => {
      //* mockImplementation return value must include json key or function throws, failing the test
      const commonHeaders = { headers: { "Accept": "application/json" } };
      await GetPostList(); //* Return value unnecessary for this test
      expect(fetchSpy).lastCalledWith('/api/posts?project_type=null', commonHeaders); //* Default param properly interpolated

      await GetPostList('project');
      expect(fetchSpy).lastCalledWith('/api/posts?project_type=project', commonHeaders); //* Inserted param properly interpolated
    })
    test("invalid status code from response causes an early return", async () => {
      const emptyResponse = await GetPostList('project'); //* Basic 200 status without any values sent back yields
      expect(emptyResponse).toStrictEqual({ majorProjects: [], minorProjects: [] }); //* Simple empty object w/ expected JSON keys

      fetchSpy.mockImplementationOnce(() => ({ status: 400 }));
      const badResponse = await GetPostList();
      expect(badResponse).toBe(undefined); //* 400 status or higher yields undefined BUT maybe should still yield empty object like below?
    })
    test("prevent body from receiving incorrect values, only adding in expected project types", async () => {
      fetchSpy.mockImplementationOnce(() => {
        return { status: 200, json: () => [{ project_size: 'major_project' }, { project_size: 'small_project' }] }
      }); //* Basic reply each with a single major and minor project
      const filledResponse = await GetPostList();
      expect(filledResponse.majorProjects).toHaveLength(1) //* 1 object added to each final generated JSON key
      expect(filledResponse.minorProjects).toHaveLength(1)
  
      fetchSpy.mockImplementationOnce(() => ({ status: 200, json: () => ({ project_size: 'major_project' }) }));
      const singleMajorResponse = await GetPostList(); //* Single major project
      expect(singleMajorResponse.majorProjects).toHaveLength(1); //* 1 object added
      expect(singleMajorResponse.minorProjects).toHaveLength(0); //* No small projects to add so empty array
  
      fetchSpy.mockImplementationOnce(() => ({ status: 200, json: () => ({ project_size: 'small_project' }) }));
      const singleMinorResponse = await GetPostList(); //* Single small project
      expect(singleMinorResponse.majorProjects).toHaveLength(0); //* No major project added to array
      expect(singleMinorResponse.minorProjects).toHaveLength(1); //* 1 small project objected added
      
      fetchSpy.mockImplementationOnce(() => ({ status: 200, json: () => 'unexpected!' }));
      const singleBadTypeResponse = await GetPostList(); //* MUST be an object type to be added into either array
      expect(singleBadTypeResponse.majorProjects).toHaveLength(0); //* Empty for both
      expect(singleBadTypeResponse.minorProjects).toHaveLength(0);
  
      fetchSpy.mockImplementationOnce(() => ({ status: 200, json: () => ({ project_size: 'bad_project' }) }));
      const singleBadObjectResponse = await GetPostList(); //* Must also have valid value set in project_size prop
      expect(singleBadObjectResponse.majorProjects).toHaveLength(0); //* Empty arrays for both again
      expect(singleBadObjectResponse.minorProjects).toHaveLength(0);
  
      fetchSpy.mockImplementationOnce(() => ({ status: 200, json: () => ({ missing_size: 'small_project' }) }));
      const singleBadObjectPropResponse = await GetPostList(); //* Without a project_size prop, object is also invalid
      expect(singleBadObjectPropResponse.majorProjects).toHaveLength(0); //* Empty arrays again
      expect(singleBadObjectPropResponse.minorProjects).toHaveLength(0);


      process.env = { ...originalEnv, REACT_APP_ABOUT_ME_ID: '200'}
      fetchSpy.mockImplementationOnce(() => ({ status: 200, json: () => ({ id: '200' }) }));
      const singleAlternateResponse = await GetPostList(); //* IF id matches expected about_me post ID
      expect(singleAlternateResponse.majorProjects).toHaveLength(1); //* THEN Insert it into majorProjects array
      expect(singleAlternateResponse.minorProjects).toHaveLength(0);
      process.env = originalEnv;
    })
  })
  test("generic POST data request returns body in JSON form if valid status code", async () => { //* 
    const badResponse = new Response("foobar", { status: 400 }) //* IF 400 or above status code
    const fetchSpy = jest.spyOn(global, "fetch").mockImplementationOnce(() => badResponse);
    const badJsonResponse = await postData("hello");
    expect(badJsonResponse).toBe(undefined); //* THEN will receive undefined return

    fetchSpy.mockImplementationOnce(() => ({ json: () => 'Success' })); //* Missing status!
    const invalidResponse = await postData("hello");
    expect(invalidResponse).toBe(undefined);

    fetchSpy.mockImplementationOnce(() => ({ json: () => 'Success', status: 200 }));
    const jsonResponse = await postData("hello"); //* Valid status 
    expect(jsonResponse).toBe('Success'); //* THEN return json response

    fetchSpy.mockRestore();
  })

  test("post new email", () => {
    //todo After refactoring into an API directory each with its own directory, this will probably be more testable
  })
  test("process turnstile response", async () => { // todo Can probably go into a 3rd party API file
    const badResponse = undefined; //* Missing response so return false, NOT human
    const badProcess = await ProcessTurnstileResponse(badResponse)
    expect(badProcess).toBe(false);

    //* Should get a success flag equal to true
    const unsuccessfulResponse = { success: false } //* If false
    const unsuccessfulProcess = await ProcessTurnstileResponse(unsuccessfulResponse);
    expect(unsuccessfulProcess).toBe(false); //* THEN not human

    //* Should NOT get any error codes
    const errorCodedResponse = { success: true, "error-codes": ["foobar"] }
    const errorCodedProcess = await ProcessTurnstileResponse(errorCodedResponse);
    expect(errorCodedProcess).toBe(false); //* If has error-codes THEN not human

    //* Should receive a timestamp that we were verified humans!
    const missingTimestampResponse = { success: true, "error-codes": [] }
    const missingTimestampProcess = await ProcessTurnstileResponse(missingTimestampResponse);
    expect(missingTimestampProcess).toBe(false); //* If missing timestamp THEN not human

    //* Should NOT be missing a message key-val pair
    const missingMessageResponse = { success: true, "error-codes": [], "challenge_ts": "1:00pm" }
    const missingMessageProcess = await ProcessTurnstileResponse(missingMessageResponse);
    expect(missingMessageProcess).toBe(false); //* If missing message THEN not human

    //* Should receive a success message, NOT a bad one
    const incorrectMessageResponse = { success: true, "error-codes": [], "challenge_ts": "1:00pm", "message": "bad" }
    const incorrectMessageProcess = await ProcessTurnstileResponse(incorrectMessageResponse);
    expect(incorrectMessageProcess).toBe(false); //* If getting unexpected message THEN not human
    //* Following are only valid responses, either a default Success! or an expected hard-coded one
    const defaultMessageResponse = { success: true, "error-codes": [], "challenge_ts": "1:00pm", "message": "Success!" }
    const defaultMessageProcess = await ProcessTurnstileResponse(defaultMessageResponse);
    expect(defaultMessageProcess).toBe(true); //* If getting expected default message THEN human
    const differentExpectedMessageResponse = { success: true, "error-codes": [], "challenge_ts": "1:00pm", "message": "Another Success!" }
    const differentExpectedMessageProcess = await ProcessTurnstileResponse(differentExpectedMessageResponse, "Another Success!");
    expect(differentExpectedMessageProcess).toBe(true); //* If getting expected alternate message THEN human
  })
});