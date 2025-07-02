import { User } from "@/app/auth/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface Chat {
  _id: string;
  participants: User;
  lastMessage: string | null;
  lastMessageTime: string;
  isRead: boolean;
  sentByMe?: boolean;
}

interface ChatListState {
  chats: Chat[];
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
    fetchChatsSuccess(state, action: PayloadAction<Chat[]>) {
      state.chats = action.payload;
      state.loading = false;
    },
    fetchChatsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchChatsRequest,
  fetchChatsSuccess,
  fetchChatsFailure,
} = chatListSlice.actions;

export default chatListSlice.reducer;
