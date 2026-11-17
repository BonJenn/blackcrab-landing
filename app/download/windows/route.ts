import { redirectToLatestDownload } from "../latest";

export async function GET(request: Request) {
  return redirectToLatestDownload("windows", request);
}
