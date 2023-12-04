import validate from "./validator";

describe("validating contact form data", () => {
  test("requiring both fields to be filled", () => {
    const expectedValidationErrors = { email: ["Email required", "Your email appears to be incorrect"], message: ["Message must be greater than 10 characters"] };
    expect(validate({ email: "", message: "" })).toStrictEqual(expectedValidationErrors);
  });
  test("requiring a properly formatted email", () => {
    const expectedValidationErrors = { email: ["Email required", "Your email appears to be incorrect"], message: [] };
    expect(validate({ email: "", message: "Hello World!" })).toStrictEqual(expectedValidationErrors);

    const invalidEmailError = { email: ["Your email appears to be incorrect"], message: [] };
    expect(validate({ email: "1", message: "Hello World!" })).toStrictEqual(invalidEmailError);

    const emptyValidationErrors = { email: [], message: [] };
    expect(validate({ email: "123@example.com", message: "Hello World!" })).toStrictEqual(emptyValidationErrors);
  });
  test("requiring a message of at least 10 chars", () => {
    const expectedValidationErrors = { email: [], message: ["Message must be greater than 10 characters"] };
    expect(validate({ email: "123@example.com", message: "Foobar" })).toStrictEqual(expectedValidationErrors); // Under 10 chars
    expect(validate({ email: "123@example.com", message: "Hi Bud" })).toStrictEqual(expectedValidationErrors); // Under 10 chars

    const emptyValidationErrors = { email: [], message: [] };
    expect(validate({ email: "123@example.com", message: "Hi there!!" })).toStrictEqual(emptyValidationErrors); // 10 Chars exactly
    expect(validate({ email: "123@example.com", message: "Hello world!" })).toStrictEqual(emptyValidationErrors); // Over 10 chars
  });
});