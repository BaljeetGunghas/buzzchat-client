import { call, put, takeLatest } from "redux-saga/effects";
import { fetchOnlineUsersByIds, setOnlineUserProfiles, setOnlineUserIds } from "../slices/onlineUsersSlice";
import { getOnlineUserProfiles } from "@/app/API/userAPI";
import { PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/app/auth/type";

function* fetchOnlineUsersByIdsSaga(action: PayloadAction<string[]>) {
  try {
    const res: User[] = yield call(getOnlineUserProfiles, action.payload);
    yield put(setOnlineUserProfiles(res));
    yield put(setOnlineUserIds(res.map((user) => user._id)));
  } catch (err) {
    console.error("Fetch online user profiles failed", err);
  }
}

export default function* onlineUserSaga() {
  yield takeLatest(fetchOnlineUsersByIds.type, fetchOnlineUsersByIdsSaga);
}
