import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Get client IP from various headers
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  const cfConnectingIp = request.headers.get("cf-connecting-ip")

  let ip = "unknown"

  if (cfConnectingIp) {
    ip = cfConnectingIp
  } else if (forwarded) {
    ip = forwarded.split(",")[0].trim()
  } else if (realIp) {
    ip = realIp
  }

  return NextResponse.json({ ip })
}
