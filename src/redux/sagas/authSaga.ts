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
      localStorage.setItem('user', JSON.stringify(jsonResponse));
    } else {
      yield put(loginFailure(message || 'Login failed'));
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      yield put(loginFailure(error.message));
    } else {
      yield put(loginFailure('Login error'));
    }
  } finally {
    yield put(setLoading(false));
  }
}

// 📝 Handle Register
function* handleRegister(action: PayloadAction<RegisterForm>): Generator {
  try {
    yield put(setLoading(true));

    const response: RegisterResponse = yield call(registerUser, action.payload);
    const { jsonResponse, token, output, message } = response;

    if (output === 1 && jsonResponse) {
      yield put(registerSuccess({ user: jsonResponse, token }));
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(jsonResponse));
    } else {
      yield put(registerFailure(message || 'Registration failed'));
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      yield put(registerFailure(err.message));
    } else {
      yield put(registerFailure('Registration error'));
    }
  } finally {
    yield put(setLoading(false));
  }
}

// 🚪 Handle Logout
function* handleLogout(): Generator {
  try {
    const response: { success: boolean; message: string } = yield call(logoutUser);
    yield put(logoutSuccess());
    toast.success('Logout Successfully !!');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  } catch (error: unknown) {
    if (error instanceof Error) {
      yield put(logoutFailure(error.message));
      toast.error(error.message);
    } else {
      yield put(logoutFailure('Logout error'));
      toast.error('Logout error');
    }
  }
}

// 🎯 Root Auth Saga
export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(registerRequest.type, handleRegister);
  yield takeLatest(logoutRequest.type, handleLogout);
}
