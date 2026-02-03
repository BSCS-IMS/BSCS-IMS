import { serialize } from "cookie";
import { NextResponse } from "next/server";

export async function POST() {
  const expiredCookie = serialize("session", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),  // delete cookie immediately
  });

  return new NextResponse(JSON.stringify({ message: "Logged out" }), {
    status: 200,
    headers: {
      "Set-Cookie": expiredCookie,
      "Content-Type": "application/json",
    },
  });
}
