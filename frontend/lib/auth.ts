// lib/auth.ts
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify, JWTPayload } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');

export interface SessionPayload extends JWTPayload {
  userId: string;
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt_token')?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // We cast to unknown first to satisfy TypeScript that we've acknowledged 
    // the lack of overlap between the generic JWTPayload and our specific SessionPayload.
    return payload as unknown as SessionPayload;
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  return session;
}