import { useState } from "react";
import { VerifyRecaptcha } from "../Functions/Api";
import UseNullableAsync from "./UseAsync";

export default function UseRecaptcha(onSuccess) {
  const [recaptchaScore, setRecaptchaScore] = useState(0.0);
  UseNullableAsync(VerifyRecaptcha, (data) => { setRecaptchaScore(data); onSuccess(); });
  return recaptchaScore
}