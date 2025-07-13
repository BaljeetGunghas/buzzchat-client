// src/app/api/messages/[conversationId]/route.ts
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/middleware/auth'
import { getMessagesByConversationId } from '@/controllers/message.controller'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ conversationId: string }> }
) {
    // 1) enforce auth
    const authResult = await requireAuth(req)
    if (authResult instanceof NextResponse) return authResult

    // 2) Await the params object
    const { conversationId } = await params
    // 2) delegate to your controller
    return await getMessagesByConversationId(conversationId)
}
