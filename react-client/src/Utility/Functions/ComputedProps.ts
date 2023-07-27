//* Common transformations for props

//? Adding an explicit return type for this func helps reinforce it's a tuple, enabling easy typing when destructuring
export function CreateID(objectCount: number, prefix: string): [number, string] {
  const updatedCount = ++objectCount;
  return [updatedCount, `${prefix}-${updatedCount}`];
}

//* Remove HTML Unsafe Chars then replace whitespace with hyphens
export function CleanAndKebabString(title: string) {
  //? Regex below matches chars in ranges via the wrapping brackets & delimiting hyphens, 
  //? i.e. [!-/] = '!' (ASCII 33) to '/' (ASCII 47) whereas [!-/:-?] = '!' to '/' AND ':' (ASCII 58) to '?' (ASCII 63)
  const htmlAttrUnsafeChars = new RegExp('[!-/:-?[-`{-~]+', 'g');
  return (title) ? title.toLowerCase().replace(htmlAttrUnsafeChars, '').replace(/ /g, '-') : ''
}

export function IsEmpty<T>(value: string | Array<T>) {
  return value.length === 0;
}

//* In practice, trims concatenated className strings
//* As a whole, simply provides an alternative option to using trim() on a string a la Ruby
export function Strip(value: string) {
  return value.trim();
}

//* Following used with URLs to transform kebab cased directories "about-me" to "About Me"
export function KebabCaseToTitleCase(phrase: string, wordsToSkip?: WordModifierOptions) {
  if (IsEmpty(phrase)) { return "" }
  const words = phrase.split("-");
  return TitleCase(words, wordsToSkip); //* If last param is not filled then it's undefined, so default params passed in
}
export function KebabCaseToKebabTitleCase(phrase: string, wordsToSkip?: WordModifierOptions) {
  if (IsEmpty(phrase)) { return "" }
  const words = phrase.split("-");
  const kebabTitlePhrase = TitleCase(words, wordsToSkip, word => `${word}-`)
  return kebabTitlePhrase.slice(0, -1); //* Slice off the hanging "-" so "Some-Phrase-" becomes "Some-Phrase"
}

//* Following used with obj keys to transform camelCase "aboutMe" to "About Me"
export function CamelCaseToTitleCase(phrase: string, wordsToSkip?: WordModifierOptions) {
  if (IsEmpty(phrase)) { return "" }
  const words = phrase.split(/(?=[A-Z])/);
  return TitleCase(words, wordsToSkip);
}

//* Provide the word, and whether the modifier should be applied via a boolean
type WordModifierOptions = {
  [word: string]: boolean
}

export function isString(str: any): str is string {
  return typeof str === "string";
}

//* Take a whole string and capitalize any words it encounters a la Ruby on Rails
export function TitleCase(str: string | string[], wordsToSkip: WordModifierOptions = { iOS: true }, wordTransform?: (word: string) => string) {
  if (str.length === 0) { return "" }
  if (isString(str) && !!wordsToSkip[str]) { return str } //* Check this is a str + make sure it needs to capitalized
  if (isString(str) && str.length === 1) { return str.charAt(0).toUpperCase() } //* Single letter that can be dealt with quickly

  const wordsInStr = Array.isArray(str) ? str : str.split(" "); //* If string is multiple words
  return wordsInStr.reduce((buildStr, currentStr, index) => {
    if (!!wordsToSkip[currentStr]) {
      return (index === wordsInStr.length - 1) ? (buildStr + currentStr) : (buildStr + `${currentStr} `);
    }

    const casedWord = (currentStr.length === 1)
      ? currentStr.toUpperCase()
      : currentStr.charAt(0).toUpperCase() + currentStr.slice(1);

    if (wordTransform) { return buildStr + wordTransform(casedWord) }

    //? Double ternary to form simple if-elseIf-else conditional return
    return (index === wordsInStr.length - 1) ? (buildStr + casedWord) //* Check if last (or ONLY) word in splitStr[]
      : (buildStr + `${casedWord} `);
  }, "");
}

export function DropSpecialChars(str: string) {
  return str.replace(/[+\-_~ ]+$/, ""); //? Matches "+-_~" (escapes the "-") AND whitespace
}
