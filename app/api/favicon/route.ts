import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/store";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  let url = "";
  try { url = String((await getProfile()).logo_url || ""); } catch {}
  const target = url.startsWith("/") ? url : "/logo/favicon.svg";
  return NextResponse.redirect(new URL(target, req.url), 307);
}
