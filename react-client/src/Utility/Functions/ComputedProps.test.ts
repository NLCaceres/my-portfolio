import { CreateID, DropSpecialChars, CamelCaseToTitleCase, CleanAndKebabString, KebabCaseToTitleCase, KebabCaseToKebabTitleCase } from "./ComputedProps";

describe("provides functions to transform data into UI-ready forms", () => {
  test("using a static count property and class name prefix to return a tuple that provides an ID and entity count", () => {
    const prefix = "foobar";
    const [count, id] = CreateID(1, prefix);
    expect(count).toBe(2);
    expect(id).toBe("foobar-2");
    const countIdTuple = CreateID(count, prefix);
    expect(countIdTuple).toBeInstanceOf(Array);
    expect(countIdTuple).toHaveLength(2);
    expect(countIdTuple).toContain(3);
    expect(countIdTuple).toContain("foobar-3");
  });

  test("drop special chars from a string's end via Regex pattern matching replacement", () => {
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
  });

  test("transform camelCase phrase into uppercase whitespace delimited phrase", () => {
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
  });

  test("removes html unsafe chars and kebabs the remainder of a phrase", () => {
    const testString = CleanAndKebabString("Foo!Bar/Bam:Dan?Fred[Tom`Kim{Em~");
    expect(testString).toBe("foobarbamdanfredtomkimem");

    const kebabString = CleanAndKebabString("foo bar");
    expect(kebabString).toBe("foo-bar");

    const kebabCleanString = CleanAndKebabString("Foo!Bar/Bam:Dan?Fred[Tom`Kim{Em~ fizz buzz");
    expect(kebabCleanString).toBe("foobarbamdanfredtomkimem-fizz-buzz");

    const kebabExtraCleanString = CleanAndKebabString("Foo!Bar/Bam:Dan?Fred[Tom`Kim{Em~ fizz:/ buzz");
    expect(kebabExtraCleanString).toBe("foobarbamdanfredtomkimem-fizz-buzz");
  });

  test("transform kebab-case phrase into uppercase whitespace delimited phrase", () => {
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
  });
  test("transform kebab-case phrase into uppercase kebab-case phrase", () => {
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
  });
});
