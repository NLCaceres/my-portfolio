//* Currently just Cloudflare's Turnstile but this file is left open for other possible third party APIs
export async function ProcessTurnstileResponse(response, expectedMessage = "Success!") {
  const turnstileJSON = await response;
  if (!turnstileJSON) { return false }; //* If error occurred during POST, then expect an undefined response and end processing

  if (turnstileJSON["success"] === false) { return false }

  const errorCodes = turnstileJSON["error-codes"]
  if (errorCodes && errorCodes.length > 0) { return false }

  if (turnstileJSON["challenge_ts"] === undefined) { return false }

  const serverMessage = turnstileJSON["message"]
  if (serverMessage === undefined || serverMessage !== expectedMessage) { return false }

  return true //* No keys contained invalid responses so CF-Turnstile verified user is human
}