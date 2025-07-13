///controllers/conversation.controller.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Conversation, IConversation } from '@/models/Conversation'
import { Message, IMessage } from '@/models/Message'
import { resFormat } from '@/utils/resFormat'
import { Types } from 'mongoose'
import { AppError } from './user.controller'

/**
 * POST /api/conversations
 * Create or fetch a one‐on‐one conversation.
 */
export async function getOrCreateConversation(
    req: NextRequest
): Promise<NextResponse> {
    try {
        await connectDB()

        // 1) Parse & validate
        const { senderId, receiverId } = await req.json() as {
            senderId?: string
            receiverId?: string
        }
        if (!senderId?.trim() || !receiverId?.trim()) {
            return NextResponse.json(
                resFormat(400, 'senderId and receiverId are required', null, 0),
                { status: 400 }
            )
        }

        // 2) Lookup existing
        let convo: IConversation | null = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        })

        // 3) Create if missing
        if (!convo) {
            convo = await new Conversation({
                participants: [new Types.ObjectId(senderId), new Types.ObjectId(receiverId)]
            }).save()
        }

        // 4) Return
        return NextResponse.json(
            resFormat(200, 'Conversation fetched/created successfully', convo, 1),
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
 * GET /api/conversations/:userId
 * Return all conversations for a user (excluding that user from participants).
 */
export async function getUserConversations(
    userId: string
): Promise<NextResponse> {
    try {
        await connectDB()

        // 1) Fetch & populate
        const conversations = await Conversation.find({
            participants: userId,
        }).populate(
            'participants',
            '-password -resetPasswordToken -resetPasswordExpires -verificationToken -verificationTokenExpires'
        ) as (IConversation & { participants: any[] })[]

        // 2) Strip out the requesting user
        const formatted = conversations.map(conv => {
            const others = conv.participants.filter(
                p => p._id.toString() !== userId
            )
            return {
                _id: conv._id,
                participants: others,
                createdAt: conv.createdAt,
                updatedAt: conv.updatedAt,
            }
        })

        return NextResponse.json(
            resFormat(200, 'Conversations fetched successfully', formatted, 1),
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
 * GET /api/conversations/chat-list/:userId
 * Return a chat‐list showing last message, unread counts, etc.
 */
export async function getUserChatList(
    userId: string
): Promise<NextResponse> {
    try {
        await connectDB()

        // 1) Load conversations with populated participants
        const convos = await Conversation.find({
            participants: userId,
        })
            .populate(
                'participants',
                '-password -resetPasswordToken -resetPasswordExpires -verificationToken -verificationTokenExpires'
            )
            .lean() as (IConversation & { participants: any[] })[]

        // 2) Map each to your chat‐list shape
        const list = await Promise.all(convos.map(async conv => {
            const other = conv.participants.find(
                p => p._id.toString() !== userId
            ) || null

            const lastMsg = await Message.findOne({ conversationId: conv._id })
                .sort({ createdAt: -1 })
                .lean() as (IMessage & { senderId: Types.ObjectId }) | null

            const unreadCount = await Message.countDocuments({
                conversationId: conv._id,
                receiverId: userId,
                isRead: false,
            })

            return {
                _id: conv._id,
                participants: other,
                lastMessage: lastMsg?.content ?? null,
                lastMessageTime: lastMsg?.createdAt ?? conv.updatedAt,
                isRead: lastMsg?.isRead ?? true,
                sentByMe: lastMsg?.senderId.toString() === userId,
                unreadCount,
            }
        }))

        // 3) Sort by recency
        list.sort((a, b) =>
            new Date(b.lastMessageTime).getTime() -
            new Date(a.lastMessageTime).getTime()
        )

        return NextResponse.json(
            resFormat(200, 'Chat list fetched successfully', list, 1),
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
