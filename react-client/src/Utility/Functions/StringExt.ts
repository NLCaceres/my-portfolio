//* Provides functions that act directly on strings to provide quick and simple functionality common in other languages */

export function IsString(str: any): str is string {
  return typeof str === "string";
}

export function IsEmpty<T>(value: string | Array<T>) {
  return value.length === 0;
}

//* In practice, trims concatenated className strings
//* As a whole, simply provides an alternative option to using trim() on a string a la Ruby
export function Strip(value: string) {
  return value.trim();
}

//* Provide the word, and whether a modifier should be applied via a boolean
export type WordModifierOptions = {
  [word: string]: boolean
}

//* Take a whole string and capitalize any words it encounters a la Ruby on Rails
export function TitleCase(str: string | string[], wordsToSkip: WordModifierOptions = { iOS: true }, wordTransform?: (word: string) => string) {
  if (str.length === 0) { return "" }
  if (IsString(str) && !!wordsToSkip[str]) { return str } //* Check this is a str + make sure it needs to capitalized
  if (IsString(str) && str.length === 1) { return str.charAt(0).toUpperCase() } //* Single letter that can be dealt with quickly

  const wordsInStr = Array.isArray(str) ? str : str.split(" "); //* If string is multiple words
  return wordsInStr.reduce((buildStr, currentStr, index) => {
    if (!!wordsToSkip[currentStr]) {
      return (index === wordsInStr.length - 1) ? (buildStr + currentStr) : (buildStr + `${currentStr} `);
    }

    const casedWord = (currentStr.length === 1)
      ? currentStr.toUpperCase()
      : currentStr.charAt(0).toUpperCase() + currentStr.slice(1);

    if (wordTransform) { return buildStr + wordTransform(casedWord) }

    //* Check if last (or ONLY) word in splitStr[] to prevent any extra whitespace
    return (index === wordsInStr.length - 1) ? (buildStr + casedWord) : (buildStr + `${casedWord} `);
  }, "");
}