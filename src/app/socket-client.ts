// src/app/socket-client.ts
'use client'

import { io, Socket } from 'socket.io-client'

// 1) Wake up the server so it mounts your Socket.IO listener
fetch('/api/socket').catch(console.error)

// 2) Then connect (browser only)
const socket: Socket = io({
  path: '/api/socket',       // absolute URL path to the Pages API
  transports: ['websocket'], // skip polling
  withCredentials: true,     // if you’re using cookies for auth
})

export default socket
