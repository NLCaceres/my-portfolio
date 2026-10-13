import { GetCookie } from "../../Utility/Functions/Browser";

//* Reusable functions that perform common functionality involved in making GET & POST requests
export default async function GetData<T>(url: string): Promise<T | undefined> {
  const httpResponse = await fetch(url, { headers: { "Accept": "application/json" } });
  if (!httpResponse.status || httpResponse.status >= 400) return; //* Maybe throw?
  return httpResponse.json() as T; //* PROBABLY always getting back JSON BUT maybe change in the future?
}

export async function PostData<T>(url: string, data = { }): Promise<T | undefined> {
  const csrfToken = GetCookie("CSRF-TOKEN") ?? ""; //? Required for all POST responses for security
  const httpResponse = await fetch(url, {
    method: "POST", headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrfToken }, body: JSON.stringify(data)
  });
  if (!httpResponse.status || httpResponse.status >= 400) return; //* Maybe throw?
  return httpResponse.json() as T; //? Actually returns a promise so the return must be awaited
}