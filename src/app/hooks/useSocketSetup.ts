// src/hooks/useSocketSetup.ts
'use client'

import { useEffect } from 'react'
import socket from '@/app/socket-client'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { RootState } from '@/redux/store'
import { toast } from 'sonner'
import { fetchChatsRequest, markChatAsRead } from '@/redux/slices/chatListSlice'
import { fetchOnlineUsersByIds } from '@/redux/slices/onlineUsersSlice'

export const useSocketSetup = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((s: RootState) => s.auth)

  useEffect(() => {
    if (!user?._id) return

    const onConnect = () => {
      console.log('✅ Socket connected:', socket.id)
      socket.emit('join', user._id)
    }
    const onMessage = (data: { content: string }) => {
      toast.info(`New message: ${data.content}`)
      dispatch(fetchChatsRequest(user._id))
    }
    const onOnline = (ids: string[]) => {
      dispatch(fetchOnlineUsersByIds(ids))
    }
    const onRead = ({ conversationId }: { conversationId: string }) => {
      dispatch(markChatAsRead(conversationId))
    }

    socket.on('connect', onConnect)
    socket.on('receive_message', onMessage)
    socket.on('online_users', onOnline)
    socket.on('messages_read', onRead)

    // ensure a connection
    if (!socket.connected) socket.connect()

    return () => {
      socket.off('connect', onConnect)
      socket.off('receive_message', onMessage)
      socket.off('online_users', onOnline)
      socket.off('messages_read', onRead)
    }
  }, [user, dispatch])
}
