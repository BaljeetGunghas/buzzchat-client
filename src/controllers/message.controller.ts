///controllers/message.controller.ts

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Conversation } from '@/models/Conversation'
import { Message } from '@/models/Message'
import { resFormat } from '@/utils/resFormat'
// import { io } from '@/sockets/socket' // adjust to wherever you export your io instance
import { Types } from 'mongoose'

/**
 * POST /api/messages/send
 * Body: { senderId, receiverId, content }
 */
export async function sendMessage(
    req: NextRequest
): Promise<NextResponse> {
    try {
        await connectDB()

        const { senderId, receiverId, content } = (await req.json()) as {
            senderId: string
            receiverId: string
            content: string
        }

        if (!senderId?.trim() || !receiverId?.trim() || !content?.trim()) {
            return NextResponse.json(
                resFormat(400, 'Missing required fields', null, 0),
                { status: 400 }
            )
        }

        // 1) Find or create the conversation
        let convo = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        })

        if (!convo) {
            convo = await new Conversation({
                participants: [
                    new Types.ObjectId(senderId),
                    new Types.ObjectId(receiverId),
                ],
            }).save()
        }

        // 2) Save the message
        const message = await new Message({
            senderId: new Types.ObjectId(senderId),
            receiverId: new Types.ObjectId(receiverId),
            conversationId: convo._id,
            content: content.trim(),
            isRead: false,
        }).save()

        // 3) Emit via Socket.IO to the receiver
        // io.to(receiverId).emit('receive_message', {
        //     _id: message._id,
        //     senderId,
        //     receiverId,
        //     content: message.content,
        //     conversationId: convo._id,
        //     createdAt: message.createdAt,
        // })

        // 4) Respond
        return NextResponse.json(
            resFormat(
                201,
                'Message sent',
                { message, conversationId: convo._id },
                1
            ),
            { status: 201 }
        )
    } catch (err: any) {
        console.error('sendMessage error:', err)
        return NextResponse.json(
            resFormat(500, 'Server error', null, 0),
            { status: 500 }
        )
    }
}

/**
 * GET /api/messages/[conversationId]
 */
export async function getMessagesByConversationId(
    conversationId: string
): Promise<NextResponse> {
    try {
        await connectDB()

        if (!Types.ObjectId.isValid(conversationId)) {
            return NextResponse.json(
                resFormat(400, 'Invalid conversation ID', null, 0),
                { status: 400 }
            )
        }

        const messages = await Message.find({ conversationId })
            .sort({ createdAt: 1 }) // oldest → newest
            .lean()

        return NextResponse.json(
            resFormat(200, 'Messages fetched successfully', messages, 1),
            { status: 200 }
        )
    } catch (err: any) {
        console.error('getMessagesByConversationId error:', err)
        return NextResponse.json(
            resFormat(500, 'Server error', null, 0),
            { status: 500 }
        )
    }
}
