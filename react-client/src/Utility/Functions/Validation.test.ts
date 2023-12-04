import getErrorMessage from "./ErrorTyping";
import { requireLength, validEmail } from "./Validation";

describe("validates different data upon a set of criteria", () => {
  describe("like strings", () => {
    describe("of a specified min and max length", () => {
      test("where strings can equal the max or min BUT NOT exceed it", () => {
        const validMinString = requireLength("foo", 2);
        expect(validMinString).toBe(true);
        const validMinEqualString = requireLength("foo", 3);
        expect(validMinEqualString).toBe(true);

        const invalidMinString = requireLength("fo", 3);
        expect(invalidMinString).toBe(false);

        const validMaxString = requireLength("foo", 0, 4);
        expect(validMaxString).toBe(true);
        const validMaxEqualString = requireLength("foo", 0, 3);
        expect(validMaxEqualString).toBe(true);

        const invalidMaxString = requireLength("foob", 0, 3);
        expect(invalidMaxString).toBe(false);
      });
      test("where strings must not be empty unless min is set to 0", () => {
        const invalidEmptyString = requireLength("");
        expect(invalidEmptyString).toBe(false);

        const validEmptyString = requireLength("", 0);
        expect(validEmptyString).toBe(true);
      });
      test("where min and max can not be negative", () => {
        try { requireLength("foo", -1); }
        catch (err) { expect(getErrorMessage(err)).toBe("Incorrect use of min"); }

        try { requireLength("foo", -1, -1); }
        catch (err) { expect(getErrorMessage(err)).toBe("Incorrect use of min and max"); }

        try { requireLength("foo", 1, -1); }
        catch (err) { expect(getErrorMessage(err)).toBe("Incorrect use of max"); }
      });
    });

    describe("of emails", () => {
      // TODO: Should probably always be add more potentially weird but valid emails to check against as they spring to mind
      test("that meet simple expected criteria", () => {
        const basicEmail = "hello@example.com";
        expect(validEmail(basicEmail)).toBe(true);

        //! Emails that start with odd prefixes
        const whitespacedEmail = "   hello@example.com"; //? Should this type of string be trimmed?
        expect(validEmail(whitespacedEmail)).toBe(false);
        const oddStartEmail = "!hello@example.com"; //* As long as it doesn't start with an @, this line works. See line 63
        expect(validEmail(oddStartEmail)).toBe(true);
        const numberStartEmail = "213hello@example.com";
        expect(validEmail(numberStartEmail)).toBe(true);

        const whiteEndingEmail = "hello@example.com     "; //? Should this type of string be trimmed at the suffix?
        expect(validEmail(whiteEndingEmail)).toBe(false);

        //! Multiple "@" signs are not allowed at all
        const doubleAtSignEmail = "hello@example@something.com";
        expect(validEmail(doubleAtSignEmail)).toBe(false);
        const prefixedAtSignEmail = "@hello@example.com";
        expect(validEmail(prefixedAtSignEmail)).toBe(false);
        const suffixedAtSignEmail = "hello@example.com@";
        expect(validEmail(suffixedAtSignEmail)).toBe(false);

        //! Dot separated like with TLDs and subdomains
        const ukEmail = "hello@example.co.uk"; //* Since some TLDs use multiple ".", it catches them after the "@"
        expect(validEmail(ukEmail)).toBe(true);
        const canadaEmail = "hello@example.ca"; //* On the other hand, Canada TLD also works fine since not "." separated
        expect(validEmail(canadaEmail)).toBe(true);
        const doubleDotEmail = "hello@example.com.edu"; //* Another example of the suffix after "@" being allowed a subdomain-like style
        expect(validEmail(doubleDotEmail)).toBe(true);
        const subdomainEmail = "hello@example.foobar.net"; //* Another example of the suffix after "@" being allowed a subdomain-like style
        expect(validEmail(subdomainEmail)).toBe(true);
        const doubleDotPrefixEmail = "hello.world@example.com"; //* Okay to have "." in prefix as well!
        expect(validEmail(doubleDotPrefixEmail)).toBe(true);
        //! Not all TLDs will work though
        const longTldEmail = "hello@example.tickets"; //* Newer TLDs can be 7+ chars and all kinds of odd names
        expect(validEmail(longTldEmail)).toBe(false); //* But these will fail since only common ones expected
        const longNormalTldEmail = "hello@example.college"; //* Normal sounding since it seems like edu
        expect(validEmail(longNormalTldEmail)).toBe(false); //* But still fails
        const shortTypoTldEmail = "hello@example.c"; //* Likely a typo BUT 1 letter TLDs are technically accepted by IANA
        expect(validEmail(shortTypoTldEmail)).toBe(false); //* 1 char TLD will definitely fail

        //! Odd separator emails like hyphens, underscores, etc
        const hyphenatedEmail = "hello-world@example.com";
        expect(validEmail(hyphenatedEmail)).toBe(true);
        const underscoredEmail = "hello_world@example.com";
        expect(validEmail(underscoredEmail)).toBe(true);
        const ampersandEmail = "hello&world@example.com";
        expect(validEmail(ampersandEmail)).toBe(true);
      });
    });
  });
});