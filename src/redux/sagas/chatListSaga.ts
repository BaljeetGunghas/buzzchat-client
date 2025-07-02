import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchChatsRequest,
  fetchChatsSuccess,
} from "../slices/chatListSlice";
import { getUserConversationsChatList } from "@/app/API/conversationsAPI";
import { GetConversationChatListResponse } from "@/app/API/types/conversation";

function* fetchChatsSaga(action: ReturnType<typeof fetchChatsRequest>) {
  try {
    const userId = action.payload;
    const response : GetConversationChatListResponse = yield call(getUserConversationsChatList, userId);
    yield put(fetchChatsSuccess(response.jsonResponse));
   } catch (error: unknown) {
      if (error instanceof Error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        console.log(axiosError);
        
      } else {
        console.log("Something went wrong. Try again.");
      }
    }
}

export default function* chatListWatcherSaga() {
  yield takeLatest(fetchChatsRequest.type, fetchChatsSaga);
}
