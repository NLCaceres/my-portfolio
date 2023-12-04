import { IsEmpty, TitleCase, WordModifierOptions } from "./StringExt";

//* Common transformations for props */

//! Quick Creation Helper
//? Adding an explicit return type for this func helps reinforce it's a tuple, enabling easy typing when destructuring
export function CreateID(objectCount: number, prefix: string): [number, string] {
  const updatedCount = ++objectCount;
  return [updatedCount, `${prefix}-${updatedCount}`];
}

//! Quick Removal Helper
export function DropSpecialChars(str: string) {
  return str.replace(/[+\-_~ ]+$/, ""); //? Matches "+-_~" (escapes the "-") AND whitespace
}

//! Casing Transformations
//* Following used with obj keys to transform camelCase "aboutMe" to "About Me"
export function CamelCaseToTitleCase(phrase: string, wordsToSkip?: WordModifierOptions) {
  if (IsEmpty(phrase)) { return ""; }
  const words = phrase.split(/(?=[A-Z])/);
  return TitleCase(words, wordsToSkip);
}

//* Remove HTML Unsafe Chars then replace whitespace with hyphens
export function CleanAndKebabString(title: string) {
  //? Regex below matches chars in ranges via the wrapping brackets & delimiting hyphens,
  //? i.e. [!-/] = '!' (ASCII 33) to '/' (ASCII 47) whereas [!-/:-?] = '!' to '/' AND ':' (ASCII 58) to '?' (ASCII 63)
  const htmlAttrUnsafeChars = new RegExp("[!-/:-?[-`{-~]+", "g");
  return (title) ? title.toLowerCase().replace(htmlAttrUnsafeChars, "").replace(/ /g, "-") : "";
}

//* Following used with URLs to transform kebab cased directories "about-me" to "About Me"
export function KebabCaseToTitleCase(phrase: string, wordsToSkip?: WordModifierOptions) {
  if (IsEmpty(phrase)) { return ""; }
  const words = phrase.split("-");
  return TitleCase(words, wordsToSkip); //* If last param is not filled then it's undefined, so default params passed in
}
export function KebabCaseToKebabTitleCase(phrase: string, wordsToSkip?: WordModifierOptions) {
  if (IsEmpty(phrase)) { return ""; }
  const words = phrase.split("-");
  const kebabTitlePhrase = TitleCase(words, wordsToSkip, word => `${word}-`);
  return kebabTitlePhrase.slice(0, -1); //* Slice off the hanging "-" so "Some-Phrase-" becomes "Some-Phrase"
}
