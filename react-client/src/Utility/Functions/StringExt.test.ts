import { IsEmpty, IsString, Strip, TitleCase } from "./StringExt";

describe("provides utility functions for string types", () => {
  test("checking if a string or arrays are empty", () => {
    expect(IsEmpty("Foobar")).toBe(false);
    expect(IsEmpty(["Foobar"])).toBe(false);
    expect(IsEmpty("Foo Bar")).toBe(false);
    expect(IsEmpty(["Foo", "Bar"])).toBe(false);

    //* Only two valid options should be blank strings or empty arrays
    expect(IsEmpty([])).toBe(true);
    expect(IsEmpty("")).toBe(true);
  })
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
  })

  test("provides an alternative method of calling trim to remove whitespace", () => {
    expect(Strip("Hello World")).toBe("Hello World");
    expect(Strip("Hello World  ")).toBe("Hello World");
    expect(Strip("  Hello World")).toBe("Hello World");
    expect(Strip("  Hello World  ")).toBe("Hello World");
    expect(Strip("Hello   World")).toBe("Hello   World"); //* Whitespace in the middle stays the same
    
    expect(Strip(" World")).toBe("World");
    expect(Strip(" World ")).toBe("World");
    expect(Strip("World ")).toBe("World");
  })

  describe("transform a string into a 'Title Case String'", () => {
    test("handling strings whether a single char, a single word, or multiple words", () => {
      expect(TitleCase("")).toBe(""); //* Empty strings get back empty strings
      
      //* Just returned back as an uppercase version
      expect(TitleCase("b")).toBe("B");
      expect(TitleCase("C")).toBe("C"); //* Remains the same
      
      //* After split() both strings should be contained in an array, then reduced to a Capital version
      expect(TitleCase("fo")).toBe("Fo");
      expect(TitleCase("Bar")).toBe("Bar"); //* Remains the same
  
      expect(TitleCase("foo bar")).toBe("Foo Bar");
      expect(TitleCase("Bar foo")).toBe("Bar Foo");
  
      //* Single letter words in between are capitalized as well
      expect(TitleCase("foo a bar")).toBe("Foo A Bar");
      expect(TitleCase("Bar foo a")).toBe("Bar Foo A");
  
      expect(TitleCase("abc def ghi")).toBe("Abc Def Ghi");
      //* Other already Uppercased letters remain the same
      expect(TitleCase("aBc DeF gHi")).toBe("ABc DeF GHi");
    })
    test("can skip words using a mapper obj if needed", () => {
      //* Skips iOS by default
      expect(TitleCase("iOS")).toBe("iOS");
      expect(TitleCase("iOS hello")).toBe("iOS Hello");
      expect(TitleCase("iOS hello World")).toBe("iOS Hello World");
      expect(TitleCase("iOS hello world")).toBe("iOS Hello World");
  
      //* Replaces the default obj turning "iOS" into "IOS"
      expect(TitleCase("iOS hello", { hello: true })).toBe("IOS hello");
      expect(TitleCase("hello iOS hello", { hello: true })).toBe("hello IOS hello");
      expect(TitleCase("hello iOS Hello", { hello: true })).toBe("hello IOS Hello"); //* Already capitalized skipped-words remain so
      expect(TitleCase("iOS hello", { hello: false })).toBe("IOS Hello");
      
      //* If true, then NO capitalization, If false then capitalize
      expect(TitleCase("iOS hello", { iOS: false, hello: true })).toBe("IOS hello");
      expect(TitleCase("iOS hello", { iOS: true, hello: true })).toBe("iOS hello");
    })
    test("provides additional transformation options", () => {
      //* Additional transforms can be useful to append or prepend
      expect(TitleCase("hello", {}, word => `${word}-`)).toBe("Hello-");
      expect(TitleCase("hello world", {}, word => `${word}-`)).toBe("Hello-World-");
      expect(TitleCase("hello world", {}, word => `_${word}`)).toBe("_Hello_World");
      
      //* Transforms don't occur on words that are skipped
      expect(TitleCase("hello", { hello: true }, word => `${word}-`)).toBe("hello");
      expect(TitleCase("hello world", { hello: true }, word => `${word}-`)).toBe("hello World-");
      expect(TitleCase("hello world there", { hello: true }, word => `${word}-`)).toBe("hello World-There-");
    })
    test("handles an array of strings as if it was a simple space-separated phrase in a string", () => {
      expect(TitleCase([])).toBe(""); //* Empty arrays are treated like empty strings
  
      expect(TitleCase(["hello"])).toBe("Hello"); //* Each item is capitalized
      expect(TitleCase(["hello", "world"])).toBe("Hello World"); //* And space-separated
  
      //* Items are skipped as expected
      expect(TitleCase(["hello", "world"], { hello: true })).toBe("hello World");
      expect(TitleCase(["hello", "world", "hello"], { hello: true })).toBe("hello World hello");
      expect(TitleCase(["Hello", "world", "hello"], { hello: true })).toBe("Hello World hello");
  
      expect(TitleCase(["hello"], {}, word => `${word}-`)).toBe("Hello-"); //* Append a hyphen
      expect(TitleCase(["hello", "world"], {}, word => `${word}-`)).toBe("Hello-World-"); //* Snake-case words
  
      //* Skip transforms on words as well
      expect(TitleCase(["hello"], { hello: true }, word => `${word}-`)).toBe("hello");
      expect(TitleCase(["hello", "world"], { hello: true }, word => `${word}-`)).toBe("hello World-");
    })
  })
})
