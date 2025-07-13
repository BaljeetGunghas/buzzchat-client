// src/app/api/auth/reset-password/route.ts
import { NextRequest } from 'next/server'
import { resetPassword } from '@/controllers/auth.controller'

export async function POST(req: NextRequest) {
  return await resetPassword(req)
}
