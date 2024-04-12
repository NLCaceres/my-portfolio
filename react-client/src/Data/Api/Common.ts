import { PostData } from "./Utility";

//* Contains endpoints for Common Rails server endpoints like listing Routes or sending an Email

export type Email = {
  email: string,
  message: string
};

//* Post Endpoints
export async function SendEmail(body: Email) {
  const sentEmailJsonResponse = await PostData("/api/send-email", body);
  return sentEmailJsonResponse;
}