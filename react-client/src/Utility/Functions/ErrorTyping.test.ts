import getErrorMessage from "./ErrorTyping";

describe("converts Typescript error 'unknown' typing into standard Javascript Error objects", () => {
  test("handling the fact that any type can be thrown by Javascript", () => {
    const simpleErrorMessage = getErrorMessage(new Error("foobar"));
    expect(simpleErrorMessage).toBe("foobar");

    const nonStandardErrorMessage = getErrorMessage({ message: "error" }); //* If a normal JS object is thrown that has a message prop
    expect(nonStandardErrorMessage).toBe("error"); //* Just use the message prop like a normal Error object

    const errorJsObjMessage = getErrorMessage({ err: "foobar" }); //* If error caught is just a standard object
    expect(errorJsObjMessage).toBe("{\"err\":\"foobar\"}"); //* Then stringify it to a readable loggable version

    const jsonValueErrorMessage = getErrorMessage(123); //* Simple values get directly converted by JSON.stringify
    expect(jsonValueErrorMessage).toBe("123");

    const jsonBooleanValueErrorMessage = getErrorMessage(false);
    expect(jsonBooleanValueErrorMessage).toBe("false");

    const jsonFuncValueErrorMessage = getErrorMessage(() => 123); //* If error caught is a function
    expect(jsonFuncValueErrorMessage).toBe(""); //* No message can be displayed

    const invalidJSONStringErrorMessage = getErrorMessage(BigInt(9007199254740991));
    //* BigInt and circular JSON references will cause the underlying JSON.stringify to fail
    expect(invalidJSONStringErrorMessage).toBe("9007199254740991"); //* But String() handles it no problem
  });
});