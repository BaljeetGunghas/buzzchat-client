// src/app/api/users/status/online/route.ts
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/middleware/auth'
import { getOnlineUsers } from '@/controllers/user.controller'
import { resFormat } from '@/utils/resFormat'

export async function POST(req: NextRequest) {
    // 1) Auth
    const auth = await requireAuth(req)
    if (auth instanceof NextResponse) return auth
    const currentUserId = auth

    // 2) Parse body
    let body: unknown
    try {
        body = await req.json()
    } catch {
        return NextResponse.json(
            resFormat(400, 'Invalid JSON', null, 0),
            { status: 400 }
        )
    }

    // 3) Validate userIds array
    const { userIds } = body as { userIds?: unknown }
    if (!Array.isArray(userIds) || !userIds.every(u => typeof u === 'string')) {
        return NextResponse.json(
            resFormat(400, '`userIds` must be an array of strings', null, 0),
            { status: 400 }
        )
    }

    // 4) Delegate
    return await getOnlineUsers(userIds as string[], currentUserId)
}
