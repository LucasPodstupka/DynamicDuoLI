import { NextResponse } from "next/server";

// Keep preview / *.vercel.app hosts out of search results; www.dynamicduoli.com is canonical.
export function middleware(req) {
  const res = NextResponse.next();
  const host = (req.headers.get("host") || "").split(":")[0];
  if (host.endsWith(".vercel.app")) res.headers.set("X-Robots-Tag", "noindex");
  return res;
}

export const config = { matcher: "/:path*" };
