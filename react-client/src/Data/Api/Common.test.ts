import { SendEmail } from "./Common";
import { vi, type MockInstance } from "vitest";
import * as UtilityFuncs from "./Utility";

describe("runs common routes to Rails backend", () => {
  let PostDataSpy: MockInstance;
  beforeEach(() => {
    PostDataSpy = vi.spyOn(UtilityFuncs, "PostData").mockImplementation(() => Promise.resolve({ success: true }));
  });
  afterEach(() => { PostDataSpy.mockRestore(); }); //* Reset mocks

  test("sending new email via POST route", async () => {
    const response = await SendEmail({ email: "someEmail@example.com", message: "hello world!" });
    expect(PostDataSpy).toHaveBeenCalledTimes(1);
    expect(response).toStrictEqual({ success: true });
  });
});