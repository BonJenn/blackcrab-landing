import { redirectToLatestDownload } from "../latest";

export async function GET() {
  return redirectToLatestDownload("linux");
}
