///app/api/auth/logoutUser/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth }              from '@/middleware/auth'
import { logoutUser }               from '@/controllers/auth.controller'

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req)
  if (authResult instanceof NextResponse) {
    return authResult
  }
  // now actually call your controller
  return await logoutUser()
}
