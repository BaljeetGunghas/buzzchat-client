// src/app/api/auth/login/route.ts
import { NextRequest } from 'next/server';
import { loginUser as loginUserController } from '@/controllers/auth.controller';

export async function POST(req: NextRequest) {
  // Directly forward the NextRequest into your controller,
  // which returns a NextResponse with body, status, and cookies.
  return await loginUserController(req);
}
