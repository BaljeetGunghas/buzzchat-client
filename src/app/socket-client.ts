// src/app/socket-client.ts
'use client'

import { io, Socket } from 'socket.io-client'

// 1) Hit your pages/api/socket.ts endpoint so the server actually
//    spins up the Socket.IO listener.
fetch('/api/socket').catch(console.error)

// 2) Then create your client socket, pointing at the absolute API route:
const socket: Socket = io({
  path: '/api/socket',         // <-- absolute path, not "../api/socket"
  transports: ['websocket'],   // optional but recommended
  withCredentials: true,       // send cookies if you’re using them
})

export default socket
