// src/app/api/auth/register/route.ts
import { NextRequest } from 'next/server'
import { registerUser } from '@/controllers/auth.controller'

export async function POST(req: NextRequest) {
  return await registerUser(req)
}
