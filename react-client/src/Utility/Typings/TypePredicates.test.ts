import { IsPlainObject, IsString } from "./TypePredicates";

describe("provides common type predicates to assert value typing across the app", () => {
  test("checking if some variable is a string type", () => {
    expect(IsString(0)).toBe(false);
    expect(IsString(0.0)).toBe(false);
    expect(IsString(1)).toBe(false);
    expect(IsString(1.0)).toBe(false);
    expect(IsString(2)).toBe(false);
    expect(IsString(2.0)).toBe(false);

    expect(IsString({})).toBe(false);
    expect(IsString({ foo: "bar" })).toBe(false);

    expect(IsString([])).toBe(false);
    expect(IsString(["foo"])).toBe(false);

    expect(IsString(true)).toBe(false);
    expect(IsString(false)).toBe(false);
    expect(IsString(null)).toBe(false);
    expect(IsString(undefined)).toBe(false);

    //* Only typical strings should return true
    expect(IsString("")).toBe(true);
    expect(IsString("foobar")).toBe(true);
  });

  test("checking for a plain javascript object", () => {
    //* All the basic types fail to return true
    expect(IsPlainObject(undefined)).toBe(false);
    expect(IsPlainObject(null)).toBe(false);

    expect(IsPlainObject(false)).toBe(false);
    expect(IsPlainObject(true)).toBe(false);

    expect(IsPlainObject([])).toBe(false);
    expect(IsPlainObject("")).toBe(false);
    expect(IsPlainObject(() => { })).toBe(false);
    expect(IsPlainObject(() => 123)).toBe(false);

    expect(IsPlainObject(123)).toBe(false);
    expect(IsPlainObject("abc")).toBe(false);
    expect(IsPlainObject([1,2,3])).toBe(false);
    expect(IsPlainObject(["a", "b", "c"])).toBe(false);

    //? Objects with actual constructors will fail
    expect(IsPlainObject(new Date())).toBe(false);
    expect(IsPlainObject(new String(""))).toBe(false);
    expect(IsPlainObject(new Array(10))).toBe(false);

    //! Only simple plain objects should return true
    expect(IsPlainObject({ })).toBe(true);
    expect(IsPlainObject({ a: "1", b: "2" })).toBe(true);
    expect(IsPlainObject({ a: "1", b: { c: "d" } })).toBe(true);
  });
});