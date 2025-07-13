// 7) src/app/api/auth/google-login/route.ts
import { NextRequest } from 'next/server';
import { googleLogin } from '@/controllers/auth.controller';

export async function POST(req: NextRequest) {
  await googleLogin(req);
}
