import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchChatsRequest,
  fetchChatsSuccess,
  fetchChatsFailure,
} from "../slices/chatListSlice";
import { getUserConversationsChatList } from "@/app/API/conversationsAPI";
import { GetConversationChatListResponse } from "@/app/API/types/conversation";

function* fetchChatsSaga(action: ReturnType<typeof fetchChatsRequest>) {
  try {
    const userId = action.payload;
    const response : GetConversationChatListResponse = yield call(getUserConversationsChatList, userId);
    yield put(fetchChatsSuccess(response.jsonResponse));
  } catch (error: any) {
    yield put(fetchChatsFailure(error.message || "Failed to fetch chats"));
  }
}

export default function* chatListWatcherSaga() {
  yield takeLatest(fetchChatsRequest.type, fetchChatsSaga);
}
