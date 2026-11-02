import { getPortfolio } from "@/controllers/portfolio.controller";

// JSON endpoint backed by the same controller the page uses: GET /api/portfolio
export async function GET() {
  const data = await getPortfolio();
  return Response.json(data);
}
