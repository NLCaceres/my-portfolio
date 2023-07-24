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
  return value.length > 0;
}

//* In practice, trims concatenated className strings
//* As a whole, simply provides an alternative option to using trim() on a string a la Ruby
export function Strip(value: string) {
  return value.trim();
}

//* Following used with URLs to transform kebab cased directories 'about-me' to 'About Me'
export function KebabToUppercasePhrase(phrase: string, wordsToSkip?: WordModifierOptions, wordsToHyphenate?: WordModifierOptions) {
  if (!phrase) return '';
  const defPhrase = phrase || ''; //* Since null doesn't cause default param, '||' can create a default val
  const words = defPhrase.split('-');
  return UppercasePhrase(words, wordsToSkip, wordsToHyphenate); //* If last 2 params not filled then undefined and default params passed in
}

//* Following used with obj keys to transform camelCase 'aboutMe' to 'About Me'
export function CamelCaseToUppercasePhrase(phrase: string, wordsToSkip?: WordModifierOptions) {
  if (!phrase) return '';
  const defPhrase = phrase || '';
  const words = defPhrase.split(/(?=[A-Z])/);
  return UppercasePhrase(words, wordsToSkip);
}

//* Provide the word, and whether the modifier should be applied via a boolean
type WordModifierOptions = {
  [word: string]: boolean
}

function UppercasePhrase(words: string[], wordsToSkip: WordModifierOptions = { iOS: true }, wordsToHyphenate: WordModifierOptions = { 'front-end': true, 'back-end': true }) {
  let title;
  if (!Array.isArray(words)) return; //* Could throw instead
  for (let i = 0; i < words.length; i++) {
    const currentWord = words[i];
    if (i === 0) {
      title = (wordsToSkip[currentWord]) ? currentWord : currentWord.charAt(0).toUpperCase() + currentWord.slice(1);
    }
    else if (wordsToSkip[currentWord]) { title += ` ${currentWord}` } //* No capital needed. Tack on word, and move on
    else {
      const prevWord = words[i-1]; //* Safe since should be at second index now
      const currentUppercasedWord = currentWord.charAt(0).toUpperCase() + currentWord.slice(1); //* Slice should handle 'out of bounds index' err
      title += (wordsToHyphenate[`${prevWord}-${currentWord}`]) //* Some words SHOULD be hyphenated
        ? `-${currentUppercasedWord}` //* 'front-end' to 'Front-End'
        : ` ${currentUppercasedWord}`; //* 'front-end' to 'Front End'
    }
  }
  return title;
}
