import ConsoleLogger from "./LoggerFuncs";
import IsPlainObject from "lodash/isPlainObject";

export function GetCsrfCookie() {
  const splitCookies = document.cookie.split('; ');
  //? Following searches through each cookie string to find CSRF cookie's "CSRF-TOKEN" prefix
  //? Then splits the key and value into a [key, value] arr, taking only the value from index 1
  return splitCookies.find(cookie => cookie.startsWith("CSRF-TOKEN=")).split('=')[1];
}
//* qParams should probably be required BUT for now default to 'null' which returns aboutMe
export default async function GetPostList(qParams = 'null') {
  const httpResponse = await fetch(`/api/posts?project_type=${qParams}`, { headers: { "Accept": "application/json" } });
  if (!httpResponse.status || httpResponse.status >= 400) return; //* Maybe throw?
  const jsonResponse = await httpResponse.json();

  const projectList = { majorProjects: [], minorProjects: [] };
  if (Array.isArray(jsonResponse)) { //* Rails SHOULD always return an [] (even if empty) but best to be safe
    projectList.majorProjects = jsonResponse.filter(project => project["project_size"] === "major_project");
    projectList.minorProjects = jsonResponse.filter(project => project["project_size"] === "small_project");
  } 
  else if (IsPlainObject(jsonResponse)) { 
    const majorProjSizeCheck = jsonResponse.project_size && jsonResponse.project_size === "major_project";
    const minorProjSizeCheck = jsonResponse.project_size && jsonResponse.project_size === "small_project";
    const idCheck = jsonResponse.id && jsonResponse.id.toString() === process.env.REACT_APP_ABOUT_ME_ID;
    
    if (majorProjSizeCheck || idCheck) { projectList.majorProjects.unshift(jsonResponse) }
    else if (minorProjSizeCheck) { projectList.minorProjects.unshift(jsonResponse) }
  }
  return projectList;
}

//* Post Endpoints
export async function postData(url, data = { }) {
  const csrfToken = GetCsrfCookie(); //? Required for all POST responses for security
  const httpResponse = await fetch(url, { 
    method: "POST", headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken }, body: JSON.stringify(data) 
  });
  if (!httpResponse.status || httpResponse.status >= 400) return; //* Maybe throw?
  return httpResponse.json() //? Actually returns a promise so the return must be awaited
}
export async function SendEmail(body) {
  const sentEmailJsonResponse = await postData("/api/send-email", body)
  return sentEmailJsonResponse;
}
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
