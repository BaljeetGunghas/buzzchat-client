// src/app/api/messages/send/route.ts
export const runtime = 'nodejs'     // because we use mongoose

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth }               from '@/middleware/auth'
import { sendMessage } from '@/controllers/message.controller'

export async function POST(req: NextRequest) {
  // 1) enforce auth
  const authResult = await requireAuth(req)
  if (authResult instanceof NextResponse) return authResult

  // 2) delegate to your controller, which returns a NextResponse
  return await sendMessage(req)
}
