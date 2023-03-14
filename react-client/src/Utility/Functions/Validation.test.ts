import { requireLength, validEmail } from "./Validation";

describe("validates different data upon a set of criteria", () => {
  describe("like strings", () => {
    describe("of a specified min and max length", () => {
      test("where strings can equal the max or min BUT NOT exceed it", () => {
        let validMinString = requireLength("foo", 2);
        expect(validMinString).toBe(true);
        let validMinEqualString = requireLength("foo", 3);
        expect(validMinEqualString).toBe(true);

        let invalidMinString = requireLength("fo", 3);
        expect(invalidMinString).toBe(false);

        let validMaxString = requireLength("foo", 0, 4);
        expect(validMaxString).toBe(true);
        let validMaxEqualString = requireLength("foo", 0, 3);
        expect(validMaxEqualString).toBe(true);

        let invalidMaxString = requireLength("foob", 0, 3);
        expect(invalidMaxString).toBe(false);
      })
      test("where strings must not be empty unless min is set to 0", () => {
        let invalidEmptyString = requireLength("");
        expect(invalidEmptyString).toBe(false);

        let validEmptyString = requireLength("", 0);
        expect(validEmptyString).toBe(true);
      })
      test("where min and max can not be negative", () => {
        try { requireLength("foo", -1) }
        catch (err) { if (err instanceof Error) { expect(err.message).toBe("Incorrect use of min") } }

        try { requireLength("foo", -1, -1) }
        catch (err) { if (err instanceof Error) { expect(err.message).toBe("Incorrect use of min and max") } }

        try { requireLength("foo", 1, -1) }
        catch (err) { if (err instanceof Error) { expect(err.message).toBe("Incorrect use of max") } }
      })
    })

    describe("of emails", () => { 
      // TODO: Should probably always be add more potentially weird but valid emails to check against as they spring to mind
      test("that meet simple expected criteria", () => {
        let basicEmail = "hello@example.com";
        expect(validEmail(basicEmail)).toBe(true);

        //! Emails that start with odd prefixes
        let whitespacedEmail = "   hello@example.com"; //? Should this sort of string be trimmed?
        expect(validEmail(whitespacedEmail)).toBe(false);
        let oddStartEmail = "!hello@example.com"; //* As long as it doesn't start with an @, this line works. See line 59
        expect(validEmail(oddStartEmail)).toBe(true);
        let numberStartEmail = "213hello@example.com";
        expect(validEmail(numberStartEmail)).toBe(true);

        let whiteEndingEmail = "hello@example.com     "; //? Should this sort of string be trimmed at the suffix?
        expect(validEmail(whiteEndingEmail)).toBe(false);

        //! Multiple "@" signs are not allowed at all
        let doubleAtSignEmail = "hello@example@something.com"
        expect(validEmail(doubleAtSignEmail)).toBe(false);
        let prefixedAtSignEmail = "@hello@example.com"
        expect(validEmail(prefixedAtSignEmail)).toBe(false);
        let suffixedAtSignEmail = "hello@example.com@"
        expect(validEmail(suffixedAtSignEmail)).toBe(false);

        //! Dot separated like with TLDs and subdomains
        let ukEmail = "hello@example.co.uk"; //* Since some TLDs use multiple ".", it catches them after the "@"
        expect(validEmail(ukEmail)).toBe(true);
        let canadaEmail = "hello@example.ca"; //* On the other hand, Canada TLD also works fine since not "." separated
        expect(validEmail(canadaEmail)).toBe(true);
        let doubleDotEmail = "hello@example.com.edu"; //* Another example of the suffix after "@" being allowed a subdomain-like style
        expect(validEmail(doubleDotEmail)).toBe(true);
        let subdomainEmail = "hello@example.foobar.net"; //* Another example of the suffix after "@" being allowed a subdomain-like style
        expect(validEmail(subdomainEmail)).toBe(true);
        let doubleDotPrefixEmail = "hello.world@example.com" //* Okay to have "." in prefix as well!
        expect(validEmail(doubleDotPrefixEmail)).toBe(true);

        //! Odd separator emails like hyphens, underscores, etc
        let hyphenatedEmail = "hello-world@example.com"
        expect(validEmail(hyphenatedEmail)).toBe(true);
        let underscoredEmail = "hello_world@example.com"
        expect(validEmail(underscoredEmail)).toBe(true);
        let ampersandEmail = "hello&world@example.com"
        expect(validEmail(ampersandEmail)).toBe(true);
      })
    })
  })
})