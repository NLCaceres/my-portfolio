//* Common transformations for props

export function CreateID(objectCount, prefix) {
  const updatedCount = ++objectCount;
  return [updatedCount, `${prefix}-${updatedCount}`];
}

//* Remove HTML Unsafe Chars then replace whitespace with hyphens
export function CleanAndKebabString(title) {
  //? Regex below matches chars in ranges via the wrapping brackets & delimiting hyphens, 
  //? i.e. [!-/] = '!' (ASCII 33) to '/' (ASCII 47) whereas [!-/:-?] = '!' to '/' AND ':' (ASCII 58) to '?' (ASCII 63)
  const htmlAttrUnsafeChars = new RegExp('[!-/:-?[-`{-~]+', 'g');
  return (title) ? title.toLowerCase().replace(htmlAttrUnsafeChars, '').replace(/ /g, '-') : ''
}

//* Following used with URLs to transform kebab cased directories 'about-me' to 'About Me'
export function KebabToUppercasePhrase(phrase, skippableWords, hyphenatedByDefault) {
  if (!phrase) return '';
  const defPhrase = phrase || ''; //* Since null doesn't cause default param, '||' can create a default val
  const words = defPhrase.split('-');
  return UppercasePhrase(words, skippableWords, hyphenatedByDefault); //* If last 2 params not filled then undefined and default params passed in
}

//* Following used with obj keys to transform camelCase 'aboutMe' to 'About Me'
export function CamelCaseToUppercasePhrase(phrase, skippableWords) {
  if (!phrase) return '';
  const defPhrase = phrase || '';
  const words = defPhrase.split(/(?=[A-Z])/);
  return UppercasePhrase(words, skippableWords);
}

function UppercasePhrase(words, skippableWords = { iOS: true }, hyphenatedByDefault = { 'front-end': true, 'back-end': true }) {
  let title;
  if (!Array.isArray(words)) return; //* Could throw
  for (let i = 0; i < words.length; i++) {
    const currentWord = words[i];
    if (i === 0) {
      title = (skippableWords[currentWord]) ? currentWord : currentWord.charAt(0).toUpperCase() + currentWord.slice(1);
    }
    else if (skippableWords[currentWord]) title += ` ${currentWord}` //* No capital needed. Tack on word, and move on
    else {
      const prevWord = words[i-1] //* Safe since should be at second index now
      const currentUppercasedWord = currentWord.charAt(0).toUpperCase() + currentWord.slice(1); //* Slice should handle 'out of bounds index' err
      title += (hyphenatedByDefault[`${prevWord}-${currentWord}`]) //* Some words SHOULD be hyphenated
        ? `-${currentUppercasedWord}` //* 'front-end' to 'Front-End'
        : ` ${currentUppercasedWord}` //* 'front-end' to 'Front End'
    }
  }
  return title;
}
