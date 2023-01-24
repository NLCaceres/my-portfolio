import { PostData } from "./Utility";

//* Contains endpoints for Common Rails server endpoints like listing Routes or sending an Email

//* Post Endpoints
export async function SendEmail(body) {
  const sentEmailJsonResponse = await PostData("/api/send-email", body)
  return sentEmailJsonResponse;
}