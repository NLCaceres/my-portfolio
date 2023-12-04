import { ProcessTurnstileResponse } from "./ThirdParty";

describe("runs requests to Third-Parties", () => {
  test("should process Cloudflare's Turnstile response", async () => {
    const badResponse = Promise.resolve(undefined); //* Missing response so return false, NOT human
    const badProcess = await ProcessTurnstileResponse(badResponse);
    expect(badProcess).toBe(false);

    //* Should get a success flag equal to true
    const unsuccessfulResponse = Promise.resolve({ success: false }); //* If false
    const unsuccessfulProcess = await ProcessTurnstileResponse(unsuccessfulResponse);
    expect(unsuccessfulProcess).toBe(false); //* THEN not human

    //* Should NOT get any error codes
    const errorCodedResponse = Promise.resolve({ success: true, "error-codes": ["foobar"] });
    const errorCodedProcess = await ProcessTurnstileResponse(errorCodedResponse);
    expect(errorCodedProcess).toBe(false); //* If has error-codes THEN not human

    //* Should receive a timestamp that we were verified humans!
    const missingTimestampResponse = Promise.resolve({ success: true, "error-codes": [] });
    const missingTimestampProcess = await ProcessTurnstileResponse(missingTimestampResponse);
    expect(missingTimestampProcess).toBe(false); //* If missing timestamp THEN not human

    //* Should NOT be missing a message key-val pair
    const missingMessageResponse = Promise.resolve({ success: true, "error-codes": [], "challenge_ts": "1:00pm" });
    const missingMessageProcess = await ProcessTurnstileResponse(missingMessageResponse);
    expect(missingMessageProcess).toBe(false); //* If missing message THEN not human

    //* Should receive a success message, NOT a bad one
    const incorrectMessageResponse = Promise.resolve({ success: true, "error-codes": [], "challenge_ts": "1:00pm", "message": "bad" });
    const incorrectMessageProcess = await ProcessTurnstileResponse(incorrectMessageResponse);
    expect(incorrectMessageProcess).toBe(false); //* If getting unexpected message THEN not human
    //* Following are only valid responses, either a default Success! or an expected hard-coded one
    const defaultMessageResponse = Promise.resolve({ success: true, "error-codes": [], "challenge_ts": "1:00pm", "message": "Success!" });
    const defaultMessageProcess = await ProcessTurnstileResponse(defaultMessageResponse);
    expect(defaultMessageProcess).toBe(true); //* If getting expected default message THEN human
    const differentExpectedMessageResponse = Promise.resolve({ success: true, "error-codes": [], "challenge_ts": "1:00pm", "message": "Another Success!" });
    const differentExpectedMessageProcess = await ProcessTurnstileResponse(differentExpectedMessageResponse, "Another Success!");
    expect(differentExpectedMessageProcess).toBe(true); //* If getting expected alternate message THEN human
  });
});