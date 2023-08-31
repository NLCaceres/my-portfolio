export function requireLength(value: string, min: number = 1, max?: number): boolean {
  var errorMessage = undefined;
  if (min < 0) { errorMessage = "Incorrect use of min" }
  if (max && max < 0) { errorMessage = (errorMessage) ? errorMessage + " and max" : "Incorrect use of max" }
  if (errorMessage) { throw new Error(errorMessage) }

  if (min !== 0 && (value.length === 0 || value === "")) { return false }
  if (min && value.length < min) { return false }
  if (max && value.length > max) { return false }
  return true
}

//? There's a few options when it comes to validating emails in Javascript
//? Most are either complex or overly simple, so I feel this represents a nice middle ground
//? This should match against most modern emails BUT it's NOT RFC RFC822 or RFC2822 compliant
//? This ultimately leaves the server to properly validate + check if the email works
//! See the tests for examples of emails that would pass vs those that fail
export function validEmail(value: string): boolean {
  //* Breakdown Regexp 
  //* 1. Must start with 1 or more characters that are not whitespace or "@" -> "/^[^\s@]+/"
  //* 2. Followed by a single "@" character -> "/@/"
  //* 3. Followed by 1 or more characters that are not whitespace or "@" -> "/[^\s@]+/"
  //* 4. A single "." character -> "/\./"
  //* 5. Finally, it must end in a 2 to 6 character TLD w/out whitespace or "@" -> "/[^\s@]{2,6}$/"
  let simpleEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,6}$/
  return simpleEmailRegex.test(value);
}