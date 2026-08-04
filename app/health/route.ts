export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    status: "ok",
    service: "aion-revenue-engine",
    mode: "zero-budget-approval-gated",
    runtime: "nextjs",
  });
}
