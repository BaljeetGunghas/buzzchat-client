// src/models/Message.ts

import mongoose, { Document, Model, Schema, Types } from 'mongoose'

/** The properties of a Message document */
export interface IMessage {
    senderId: Types.ObjectId
    receiverId: Types.ObjectId
    conversationId: Types.ObjectId
    content: string
    isRead: boolean
    createdAt: Date
    updatedAt: Date
}

/** Extends both our IMessage and Mongoose’s Document */
export interface IMessageDocument extends IMessage, Document { }

/** Schema definition */
const messageSchema = new Schema<IMessageDocument>(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // adds createdAt & updatedAt
    }
)

/**
 * Use mongoose.models.Message if available (avoids OverwriteModelError
 * in Next.js hot-reload), otherwise create a new model.
 */
export const Message: Model<IMessageDocument> =
    mongoose.models.Message ||
    mongoose.model<IMessageDocument>('Message', messageSchema)
