// src/app/api/auth/forgot-password/route.ts
export const runtime = 'nodejs'
import { NextRequest } from 'next/server'
import { forgotPassword } from '@/controllers/auth.controller'

export async function POST(req: NextRequest) {
  // Delegate directly to the controller, which returns a NextResponse
  return await forgotPassword(req)
}
