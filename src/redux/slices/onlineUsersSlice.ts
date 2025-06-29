import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/app/auth/type";

interface OnlineUsersState {
  userIds: string[];
  userProfiles: User[];
}

const initialState: OnlineUsersState = {
  userIds: [],
  userProfiles: [],
};

const onlineUsersSlice = createSlice({
  name: "onlineUsers",
  initialState,
  reducers: {
    setOnlineUserIds: (state, action: PayloadAction<string[]>) => {
      state.userIds = action.payload;
    },
    setOnlineUserProfiles: (state, action: PayloadAction<User[]>) => {
      state.userProfiles = action.payload;
    },
    fetchOnlineUsersByIds: (state, action: PayloadAction<string[]>) => {
      // Empty reducer — used to trigger saga
    },
  },
});

export const { setOnlineUserIds, setOnlineUserProfiles, fetchOnlineUsersByIds } = onlineUsersSlice.actions;
export default onlineUsersSlice.reducer;
