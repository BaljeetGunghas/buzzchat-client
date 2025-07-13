// pages/api/socket.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { Server as IOServer } from 'socket.io'
import { Server as NetServer } from 'http'
import { Socket as NetSocket } from 'net'
import { connectDB } from '@/lib/mongoose'
import { setupSocket } from '@/sockets/socket'

export const config = { api: { bodyParser: false } }

interface ResWithIO extends NextApiResponse {
  socket: NetSocket & { server: NetServer & { io?: IOServer } }
}

export default async function handler(
  req: NextApiRequest,
  res: ResWithIO
) {
  await connectDB()

  const sock = res.socket
  if (!sock.server.io) {
    console.log('🕸️  Initializing Socket.IO')
    const io = new IOServer(sock.server, {
      cors: {
        origin: [process.env.FRONTEND_URL!, /^http:\/\/localhost:\d+$/],
        credentials: true,
      },
    })
    setupSocket(io)
    sock.server.io = io
  }

  res.end()
}
