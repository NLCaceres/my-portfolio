import { SendEmail } from "./Common";
import * as UtilityFuncs from "./Utility";

describe("runs common routes to Rails backend", () => {
  let PostDataSpy;
  beforeEach(() => { 
    PostDataSpy = jest.spyOn(UtilityFuncs, "PostData").mockImplementation(() => ({ success: true }));
  })
  afterEach(() => { PostDataSpy.mockRestore() }) //* Reset mocks
  
  test("sending new email via POST route", async () => {
    const response = await SendEmail({ email: "someEmail@example.com", message: "hello world!" });
    expect(PostDataSpy).toHaveBeenCalledTimes(1);
    expect(response).toStrictEqual({ success: true });
  })
})