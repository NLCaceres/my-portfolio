import { CreateID, CleanAndKebabString, KebabCaseToTitleCase, KebabCaseToKebabTitleCase, 
  IsEmpty, isString, Strip, TitleCase, CamelCaseToTitleCase, DropSpecialChars } from "./ComputedProps";

describe("creates an appwide simple unique id", () => {
  //* CreateID Func
  test("using a static count property and class name prefix to return a tuple", () => {
    const prefix = 'foobar';
    const [count, id] = CreateID(1, prefix);
    expect(count).toBe(2);
    expect(id).toBe('foobar-2');
    const countIdTuple = CreateID(count, prefix);
    expect(countIdTuple).toBeInstanceOf(Array);
    expect(countIdTuple).toHaveLength(2);
    expect(countIdTuple).toContain(3);
    expect(countIdTuple).toContain("foobar-3");
  })
})

describe("provides an alternative method of calling trim to remove whitespace", () => {
  expect(Strip("Hello World")).toBe("Hello World");
  expect(Strip("Hello World  ")).toBe("Hello World");
  expect(Strip("  Hello World")).toBe("Hello World");
  expect(Strip("  Hello World  ")).toBe("Hello World");
  expect(Strip("Hello   World")).toBe("Hello   World"); //* Whitespace in the middle stays the same
  
  expect(Strip(" World")).toBe("World");
  expect(Strip(" World ")).toBe("World");
  expect(Strip("World ")).toBe("World");
})

describe("removes html unsafe chars and kebabs the remainder of a phrase", () => {
  //* CleanAndKebabString Func
  test("removes html unsafe chars and lowers case", () => {
    const testString = CleanAndKebabString('Foo!Bar/Bam:Dan?Fred[Tom`Kim{Em~')
    expect(testString).toBe('foobarbamdanfredtomkimem');
  })
  test("kebabs spaces in between", () => {
    const testString = CleanAndKebabString('foo bar');
    expect(testString).toBe('foo-bar');
  })
})

describe("provides simple string helpers", () => {
  test("checking if a string as well as arrays are empty", () => {
    expect(IsEmpty("Foobar")).toBe(false);
    expect(IsEmpty(["Foobar"])).toBe(false);
    expect(IsEmpty("Foo Bar")).toBe(false);
    expect(IsEmpty(["Foo", "Bar"])).toBe(false);

    expect(IsEmpty([])).toBe(true);
    expect(IsEmpty("")).toBe(true);
  })
  test("checking if some variable is a string", () => {
    expect(isString(0)).toBe(false);
    expect(isString(0.0)).toBe(false);
    expect(isString(1)).toBe(false);
    expect(isString(1.0)).toBe(false);
    expect(isString(2)).toBe(false);
    expect(isString(2.0)).toBe(false);

    expect(isString({})).toBe(false);
    expect(isString({ foo: "bar" })).toBe(false);

    expect(isString([])).toBe(false);
    expect(isString(["foo"])).toBe(false);

    expect(isString(true)).toBe(false);
    expect(isString(false)).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);

    expect(isString("foobar")).toBe(true);
  })
})

describe("transform kebab-case phrase into uppercase whitespace delimited phrase", () => {
  test("so 'the-cow-goes-moo' becomes 'The Cow Goes Moo", () => {
    //* Used to consider all falsy values, but now only strings SHOULD ever be passed in
    const emptyStrPhrase = KebabCaseToTitleCase("");
    expect(emptyStrPhrase).toBe("");

    const uppercaseSpacedPhrase = KebabCaseToTitleCase("the-cow-goes-moo");
    expect(uppercaseSpacedPhrase).toBe("The Cow Goes Moo");
    const normalSpacedPhrase = KebabCaseToTitleCase("the cow goes moo");
    expect(normalSpacedPhrase).toBe("The cow goes moo"); //* Only "the" is capitalized
    const uppercaseWord = KebabCaseToTitleCase("the");
    expect(uppercaseWord).toBe("The");
    const uppercaseTwoLetterWord = KebabCaseToTitleCase("is");
    expect(uppercaseTwoLetterWord).toBe("Is");
    const uppercaseLetter = KebabCaseToTitleCase("t");
    expect(uppercaseLetter).toBe("T");
    
    //* Need to re-kebab certain phrases
    const hyphenatedFrontEnd = KebabCaseToTitleCase("front-end");
    expect(hyphenatedFrontEnd).not.toBe("Front-End");
    expect(hyphenatedFrontEnd).toBe("Front End");
    const hyphenatedBackEnd = KebabCaseToTitleCase("back-end");
    expect(hyphenatedBackEnd).not.toBe("Back-End");
    expect(hyphenatedBackEnd).toBe("Back End");
  })
})
describe("transform kebab-case phrase into uppercase kebab-case phrase", () => {
  test("so 'the-cow-goes-moo' becomes 'The-Cow-Goes-Moo", () => {
    const emptyStr = KebabCaseToKebabTitleCase("");
    expect(emptyStr).toBe("");

    const uppercaseSpacedPhrase = KebabCaseToKebabTitleCase("the-cow-goes-moo");
    expect(uppercaseSpacedPhrase).toBe("The-Cow-Goes-Moo");
    const normalSpacedPhrase = KebabCaseToKebabTitleCase("the cow goes moo");
    expect(normalSpacedPhrase).toBe("The cow goes moo"); //* Only "the" is capitalized
    const uppercaseWord = KebabCaseToKebabTitleCase("the");
    expect(uppercaseWord).toBe("The");
    const uppercaseTwoLetterWord = KebabCaseToKebabTitleCase("is");
    expect(uppercaseTwoLetterWord).toBe("Is");
    const uppercaseLetter = KebabCaseToKebabTitleCase("t");
    expect(uppercaseLetter).toBe("T");
    
    const hyphenatedFrontEnd = KebabCaseToKebabTitleCase("front-end");
    expect(hyphenatedFrontEnd).toBe("Front-End");
    const hyphenatedBackEnd = KebabCaseToKebabTitleCase("back-end");
    expect(hyphenatedBackEnd).toBe("Back-End");
  })
})

describe("transform camelCase phrase into uppercase whitespace delimited phrase", () => {
  test("transforming 'theCowGoesMoo' into the 'The Cow Goes Moo'", () => {
    const uppercaseSpacedPhrase = CamelCaseToTitleCase("theCowGoesMoo");
    expect(uppercaseSpacedPhrase).toBe("The Cow Goes Moo");
    const normalSpacedPhrase = CamelCaseToTitleCase("theCow goesMoo");
    expect(normalSpacedPhrase).toBe("The Cow goes Moo"); //* "goes" is NOT capitalized since it's split as ["the", "Cow goes", "moo"]
    const uppercaseWord = CamelCaseToTitleCase("the");
    expect(uppercaseWord).toBe("The");
    const uppercaseTwoLetterWord = CamelCaseToTitleCase("is");
    expect(uppercaseTwoLetterWord).toBe("Is");
    const uppercaseLetter = CamelCaseToTitleCase("t");
    expect(uppercaseLetter).toBe("T");
  })
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

describe("drop special chars from a string's end", () => {
  test("via Regex pattern matching replacement", () => {
    expect(DropSpecialChars("")).toBe("");
    expect(DropSpecialChars("Foobar")).toBe("Foobar");
    expect(DropSpecialChars("Foo Bar")).toBe("Foo Bar");

    //* Trim whitespace
    expect(DropSpecialChars("  Foo Bar")).toBe("  Foo Bar");
    expect(DropSpecialChars("Foo Bar  ")).toBe("Foo Bar");
    
    //* All the special chars should be dropped from the end
    expect(DropSpecialChars("Foo Bar+")).toBe("Foo Bar");
    expect(DropSpecialChars("Foo Bar_")).toBe("Foo Bar");
    expect(DropSpecialChars("Foo Bar-")).toBe("Foo Bar");
    expect(DropSpecialChars("Foo Bar~")).toBe("Foo Bar");

    //* As long these chars are at the end of the str, they will all be removed
    expect(DropSpecialChars("Foo Bar_+ ")).toBe("Foo Bar");
    expect(DropSpecialChars("_+ Foo Bar")).toBe("_+ Foo Bar");

    expect(DropSpecialChars("Foo Bar_  +")).toBe("Foo Bar");
    expect(DropSpecialChars("_  +Foo Bar")).toBe("_  +Foo Bar");

    expect(DropSpecialChars("Foo Bar+~_")).toBe("Foo Bar");
    expect(DropSpecialChars("+~_Foo Bar")).toBe("+~_Foo Bar");

    expect(DropSpecialChars("Foo Bar+-_~ ")).toBe("Foo Bar");
    expect(DropSpecialChars("+-_~ Foo Bar")).toBe("+-_~ Foo Bar");
  })
})
