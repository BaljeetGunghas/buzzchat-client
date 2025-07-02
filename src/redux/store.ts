import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import authReducer from './slices/authSlice';
import onlineUserReducer from './slices/onlineUsersSlice';
import chatListReducer from './slices/chatListSlice';
import authSaga from './sagas/authSaga';
import onlineUserSaga from './sagas/onlineUsersSaga';
import chatListWatcherSaga from './sagas/chatListSaga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    onlineUser: onlineUserReducer,
    chatList: chatListReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(authSaga);
sagaMiddleware.run(onlineUserSaga);
sagaMiddleware.run(chatListWatcherSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
