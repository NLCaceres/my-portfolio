import { CreateID, CleanAndKebabString, KebabToUppercasePhrase, CamelCaseToUppercasePhrase } from "./ComputedProps";

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

describe("transform kebab-case phrase into uppercase whitespace delimited phrase", () => {
  //* UppercasePhrase Func
  test("so 'the-cow-goes-moo' becomes 'The Cow Goes Moo", () => {
    const uppercaseSpacedPhrase = KebabToUppercasePhrase('the-cow-goes-moo');
    expect(uppercaseSpacedPhrase).toBe('The Cow Goes Moo');
    const uppercaseWord = KebabToUppercasePhrase('the');
    expect(uppercaseWord).toBe('The');
    const uppercaseTwoLetterWord = KebabToUppercasePhrase('is');
    expect(uppercaseTwoLetterWord).toBe('Is');
    const uppercaseLetter = KebabToUppercasePhrase('t');
    expect(uppercaseLetter).toBe('T');

    //* Used to consider all falsy values, but now only strings SHOULD ever be passed in
    const falsyPhrase = KebabToUppercasePhrase('');
    expect(falsyPhrase).toBe('');
  })
  describe('with default params', () => {
    test("knowing some words should not be capitalized by default as well as overriding the default", () => {
      const upperCasediPhone = KebabToUppercasePhrase('iOS-phone');
      expect(upperCasediPhone).toBe('iOS Phone');

      const upperCasedPhone = KebabToUppercasePhrase('iOS-phone', { });
      expect(upperCasedPhone).toBe('IOS Phone');
      const lowerCasedPhone = KebabToUppercasePhrase('iOS-phone', { phone: true });
      expect(lowerCasedPhone).toBe('IOS phone');
    })
    test("knowing some words should be hyphenated by default as well as overriding the default", () => {
      const hyphenatedFrontEnd = KebabToUppercasePhrase('front-end');
      expect(hyphenatedFrontEnd).toBe('Front-End');
      const hyphenatedBackEnd = KebabToUppercasePhrase('back-end');
      expect(hyphenatedBackEnd).toBe('Back-End');
      //? Setting default param to undefined means func will use default val specified in definition
      const unhyphenatedFrontEnd = KebabToUppercasePhrase('front-end', undefined, {});
      expect(unhyphenatedFrontEnd).toBe('Front End');
      const fooBarHyphenated = KebabToUppercasePhrase('foo-bar', undefined, { 'foo-bar': true});
      expect(fooBarHyphenated).toBe('Foo-Bar');
    })
  })
})

describe("transform camelCase phrase into uppercase whitespace delimited phrase", () => {
  test("transforming 'theCowGoesMoo' into the 'The Cow Goes Moo'", () => {
    const uppercaseSpacedPhrase = CamelCaseToUppercasePhrase('theCowGoesMoo');
    expect(uppercaseSpacedPhrase).toBe('The Cow Goes Moo');
    const uppercaseWord = CamelCaseToUppercasePhrase('the');
    expect(uppercaseWord).toBe('The');
    const uppercaseTwoLetterWord = CamelCaseToUppercasePhrase('is');
    expect(uppercaseTwoLetterWord).toBe('Is');
    const uppercaseLetter = CamelCaseToUppercasePhrase('t');
    expect(uppercaseLetter).toBe('T');
  })
})
