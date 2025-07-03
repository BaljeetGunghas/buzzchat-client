import { ChatListJsonResponse } from "@/app/API/types/conversation";
import { User } from "@/app/auth/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface ChatListState {
  chats: ChatListJsonResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatListState = {
  chats: [],
  loading: false,
  error: null,
};

const chatListSlice = createSlice({
  name: "chatList",
  initialState,
  reducers: {
    fetchChatsRequest(state, _action: PayloadAction<string>) {
      state.loading = true;
      state.error = null;
    },
    fetchChatsSuccess(state, action: PayloadAction<ChatListJsonResponse[]>) {
      state.chats = action.payload;
      state.loading = false;
    },
    fetchChatsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },

    //mark message as read 
    markChatAsRead(state, action: PayloadAction<string>) {
      const id = action.payload;
      const chat = state.chats.find(c => c._id === id);
      if (chat) {
        chat.isRead = true;
        chat.unreadCount = 0;
      }
    }
  },
});

export const {
  fetchChatsRequest,
  fetchChatsSuccess,
  fetchChatsFailure,
  markChatAsRead
} = chatListSlice.actions;

export default chatListSlice.reducer;
