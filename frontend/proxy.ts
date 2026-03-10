import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY || 'fallback-secret');
const JWT_ALGORITHM = process.env.JWT_ALGORITHM || 'HS256';

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("jwt_token");

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await jwtVerify(token.value, JWT_SECRET_KEY, { algorithms: [JWT_ALGORITHM] });
    return NextResponse.next();
  } catch (error) {
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete('jwt_token');
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/explore-data/:path*", "/ai-analyzer/:path*"],
};
