// src/models/Conversation.ts
import mongoose, { Document, Model, Types } from 'mongoose'

// 1) Conversation document interface
export interface IConversation extends Document {
    participants: Types.ObjectId[]    // array of User IDs
    createdAt: Date
    updatedAt: Date
}

// 2) Schema definition
const conversationSchema = new mongoose.Schema<IConversation>(
    {
        participants: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
        ],
    },
    { timestamps: true }
)

// 3) Export the model (handles hot‐reload in Next.js)
export const Conversation: Model<IConversation> =
    mongoose.models.Conversation ||
    mongoose.model<IConversation>('Conversation', conversationSchema)
