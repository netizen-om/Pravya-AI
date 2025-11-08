import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true }, { status: 200 });
  
  // Clear the auth cookie
  response.cookies.delete("admin_token");
  
  return response;
}

