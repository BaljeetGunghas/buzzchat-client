import { call, put, takeLatest } from 'redux-saga/effects';
import { registerRequest, registerSuccess, registerFailure, setLoading } from '../slices/authSlice';
import { PayloadAction } from '@reduxjs/toolkit';
import { RegisterForm, RegisterResponse } from '@/app/auth/type';
import { registerUser } from '@/app/API/authAPI';

function* handleRegister(
  action: PayloadAction<RegisterForm>
): Generator<any, void, RegisterResponse> {
  try {
    yield put(setLoading(true));

    // Call registerUser which returns RegisterResponse (already data, not AxiosResponse)
    const response: RegisterResponse = yield call(registerUser, action.payload);

    const { jsonResponse, token, output, message } = response;

    if (output === 1) {
      // Pass user and token both to the success action
      yield put(registerSuccess({ user: jsonResponse, token }));
      localStorage.setItem('token', token);
    } else {
      yield put(registerFailure(message || 'Registration failed'));
    }
  } catch (err: any) {
    yield put(registerFailure(err.message || 'Registration error'));
  } finally {
    yield put(setLoading(false));
  }
}

export default function* authSaga() {
  yield takeLatest(registerRequest.type, handleRegister);
}
