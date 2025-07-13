// src/lib/mongoose.ts
import mongoose, { Mongoose } from 'mongoose'

// **Be sure you import your models here** so they're registered
import '@/models/User'
import '@/models/Conversation'
import '@/models/Message'

const MONGO_URI = process.env.MONGO_URI!
if (!MONGO_URI) throw new Error('Missing MONGO_URI')

declare global {
  var mongooseConnection: {
    conn: Mongoose | null
    promise: Promise<Mongoose> | null
  }
}

global.mongooseConnection = global.mongooseConnection || { conn: null, promise: null }
const cached = global.mongooseConnection

export async function connectDB(): Promise<Mongoose> {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((m) => m)
  }
  cached.conn = await cached.promise
  return cached.conn
}
