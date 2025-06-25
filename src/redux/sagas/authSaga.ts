import { call, put, takeLatest } from 'redux-saga/effects';
import {
  registerRequest,
  registerSuccess,
  registerFailure,
  loginRequest,
  loginSuccess,
  loginFailure,
  setLoading,
  logoutSuccess,
  logoutFailure,
  logoutRequest,
  
} from '../slices/authSlice';

import { PayloadAction } from '@reduxjs/toolkit';
import {
  LoginForm,
  RegisterForm,
  RegisterResponse,
  LoginResponse,
} from '@/app/auth/type';

import { registerUser, loginUser, logoutUser } from '@/app/API/authAPI';
import { toast } from 'sonner';

// 🔐 Handle Login
function* handleLogin(action: PayloadAction<LoginForm>) {
  try {
    yield put(setLoading(true));

    const response: LoginResponse = yield call(loginUser, action.payload);
    const { jsonResponse, token, output, message } = response;

    if (output === 1 && jsonResponse) {
      yield put(loginSuccess({ user: jsonResponse, token }));
      localStorage.setItem('token', token);
    } else {
      yield put(loginFailure(message || 'Login failed'));
    }
  } catch (error: any) {
    yield put(loginFailure(error.message || 'Login error'));
  } finally {
    yield put(setLoading(false));
  }
}

// 📝 Handle Register
function* handleRegister(
  action: PayloadAction<RegisterForm>
): Generator<any, void, RegisterResponse> {
  try {
    yield put(setLoading(true));

    const response: RegisterResponse = yield call(registerUser, action.payload);
    const { jsonResponse, token, output, message } = response;

    if (output === 1 && jsonResponse) {
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


export function* handleLogout(): Generator<any, void, { success: boolean; message: string }> {
  try {
    const response = yield call(logoutUser);

    if (response.success) {
      yield put(logoutSuccess());
      toast.success('Logout Successfully !!');
      localStorage.removeItem('token');
      window.location.href = '/'; // or use router in component
    } else {
      yield put(logoutFailure(response.message || 'Logout failed'));
      toast.error(response.message || 'Something went wrong !!');
    }
  } catch (error: any) {
    yield put(logoutFailure(error.message || 'Logout failed'));
    toast.error(error.message || 'Logout error');
  }
}


// 🎯 Root Auth Saga
export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(registerRequest.type, handleRegister);
  yield takeLatest(logoutRequest.type, handleLogout);
}
