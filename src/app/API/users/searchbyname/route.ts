// src/app/api/users/searchbyname/route.ts
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/middleware/auth'
import { searchUsersByName } from '@/controllers/user.controller'

export async function GET(req: NextRequest) {
    // 1) Auth
    const auth = await requireAuth(req)
    if (auth instanceof NextResponse) return auth

    // 2) Read the `query` parameter
    const term = req.nextUrl.searchParams.get('query')?.trim() ?? ''

    // 3) Delegate
    return await searchUsersByName(term)
}
