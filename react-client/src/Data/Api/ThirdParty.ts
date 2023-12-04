type TurnstileResponse = {
  success: boolean,
  "error-codes"?: [string], // Optional array of errors sent by Cloudflare
  challenge_ts: string,
  message: string
};

// Using Zod would probably make the following function even simpler or just eliminate the need for it all together
// It might even eliminate the need for the above declared TurnstileResponse type
function IsTurnstileResponse(response: TurnstileResponse | unknown): response is TurnstileResponse {
  return (response as TurnstileResponse)["success"] !== undefined
    && (response as TurnstileResponse)["challenge_ts"] !== undefined
    && (response as TurnstileResponse)["message"] !== undefined;
}

//* Currently just Cloudflare's Turnstile but this file is left open for other possible third party APIs
export async function ProcessTurnstileResponse(response: Promise<TurnstileResponse | unknown>, expectedMessage = "Success!") {
  const turnstileJSON = await response;
  if (!turnstileJSON) { return false; } //* If error occurred during POST, then expect an undefined response and end processing

  if (!IsTurnstileResponse(turnstileJSON)) { return false; }

  if (turnstileJSON["success"] === false) { return false; }

  const errorCodes = turnstileJSON["error-codes"] ?? [];
  if (errorCodes.length > 0) { return false; }

  const serverMessage = turnstileJSON["message"];
  if (serverMessage !== expectedMessage) { return false; }

  return true; //* No keys contained invalid responses so CF-Turnstile verified user is human
}