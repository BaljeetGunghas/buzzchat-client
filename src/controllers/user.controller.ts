// src/controllers/user.controller.ts
import { connectDB } from '@/lib/mongoose'
import { User } from '@/models/User'
import { resFormat } from '@/utils/resFormat'
import { NextResponse } from 'next/server'

export interface AppError {
    message: string
    status?: number
}
export async function getAllUsers(): Promise<NextResponse> {
    try {
        await connectDB()
        const users = await User.find()
            .select('-password -resetPasswordToken -resetPasswordExpires -verificationToken -verificationTokenExpires')
        return NextResponse.json(
            resFormat(200, 'Users fetched successfully', users, 1),
            { status: 200 }
        )
    } catch (err: unknown) {
        const error = err as AppError
        console.error(error.message)
        return NextResponse.json(
            resFormat(500, 'Server error', null, 0),
            { status: 500 }
        )
    }
}

/**
 * GET /api/users/[id]
 */
export async function getUserById(id: string): Promise<NextResponse> {
    try {
        await connectDB()
        const user = await User.findById(id)
            .select('-password -resetPasswordToken -resetPasswordExpires -verificationToken -verificationTokenExpires')
        if (!user) {
            return NextResponse.json(
                resFormat(404, 'User not found', null, 0),
                { status: 404 }
            )
        }
        return NextResponse.json(
            resFormat(200, 'User fetched successfully', user, 1),
            { status: 200 }
        )
    } catch (err: unknown) {
        const error = err as AppError
        console.error(error.message)
        return NextResponse.json(
            resFormat(500, 'Server error', null, 0),
            { status: 500 }
        )
    }
}

/**
 * POST /api/users/status/online
 * Expects JSON body { userIds: string[] }, filters out currentUserId.
 */


export async function getOnlineUsers(
    userIds: string[],
    currentUserId: string
): Promise<NextResponse> {
    try {
        await connectDB()
        const filtered = userIds.filter(id => id !== currentUserId)
        const users = await User.find({ _id: { $in: filtered } })
            .select('-password -resetPasswordToken -resetPasswordExpires -verificationToken -verificationTokenExpires')
        return NextResponse.json(
            resFormat(200, 'Online users fetched successfully', users, 1),
            { status: 200 }
        )
    } catch (err: unknown) {
        const error = err as AppError
        console.error(error.message)
        return NextResponse.json(
            resFormat(500, 'Server error', null, 0),
            { status: 500 }
        )
    }
}

/**
 * GET /api/users/searchbyname?query=foo
 */
export async function searchUsersByName(query: string): Promise<NextResponse> {
    try {
        await connectDB()
        if (!query.trim()) {
            return NextResponse.json(
                resFormat(400, 'Search query is required', null, 0),
                { status: 400 }
            )
        }
        const regex = new RegExp(query, 'i')
        
        const users = await User.find({ name: regex })
            .select('-password -resetPasswordToken -resetPasswordExpires -verificationToken -verificationTokenExpires')
        return NextResponse.json(
            resFormat(200, `Users matching "${query}"`, users, 1),
            { status: 200 }
        )
    } catch (err: unknown) {
        const error = err as AppError
        console.error(error.message)
        return NextResponse.json(
            resFormat(500, 'Server error', null, 0),
            { status: 500 }
        )
    }
}
