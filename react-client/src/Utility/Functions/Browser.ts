//* Contains functions that handle basic Browser functionality like getting specific cookies!

export function GetCookie(name: string) {
  const splitCookies = document.cookie.split('; ');
  if (splitCookies.length === 0) { return } //* No cookies, then early return
  //* Search thru each cookie key/val pair to find cookie based on name
  const foundCookie = splitCookies.find(cookie => cookie.startsWith(`${name}=`))
  if (!foundCookie) { return } //* Expected cookie not found, early return
  //* Then splits the key and value into a [key, value] arr, 
  return foundCookie.split('=')[1]; //* Take only the value from index 1
}

//? Adding slight delay allows Firefox/Safari to properly scroll to top of document
export function SmoothScroll() { //? 100 works for Firefox BUT Safari is SUPER slow so 350 works best
  setTimeout(() => window.scroll({ top: 0, left: 0, behavior: "smooth" }), 350);
} //? Could also use this function in AppRouting useTransition's onRest event BUT it seems a bit too delayed
