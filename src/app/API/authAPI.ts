// src/services/auth.ts
import axios from 'axios';
import {
  LoginForm,
  LoginResponse,
  RegisterForm,
  RegisterResponse,
} from '../auth/type';

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');
const AUTH_API = `${BASE_URL}/auth`;

export const registerUser = async (
  data: RegisterForm
): Promise<RegisterResponse> => {
  try {
    console.log('AUTH_API', AUTH_API);

    const { data: payload } = await axios.post<RegisterResponse>(
      `${AUTH_API}/register`,
      data,
      { withCredentials: true }
    );
    return payload;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string } };
      message: string;
    };
    return {
      success: false,
      message: err.response?.data?.message || err.message,
      jsonResponse: null,
      output: 0,
      token: '',
    };
  }
};

export const loginUser = async (
  data: LoginForm
): Promise<LoginResponse> => {
  try {
    const { data: payload } = await axios.post<LoginResponse>(
      `${AUTH_API}/login`,
      data,
      { withCredentials: true }
    );
    return payload;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string } };
      message: string;
    };
    return {
      success: false,
      message: err.response?.data?.message || err.message,
      jsonResponse: null,
      output: 0,
      token: '',
    };
  }
};

export const logoutUser = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const { data } = await axios.post(
      `${AUTH_API}/logoutUser`,
      {},
      { withCredentials: true }
    );
    return {
      success: true,
      message: data?.message || 'Logout successful',
    };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string } };
      message: string;
    };
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
};

export interface ResetPasswordResponse {
  status: number;
  message: string;
  jsonResponse: null;
  output: number;
}

export const resetPassword = async (email: string): Promise<ResetPasswordResponse> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}auth/forgot-password`,
      { email },
      { withCredentials: true }
    );

    return {
      status: response.status,
      message: response.data.message,
      jsonResponse: null,
      output: 1,
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message: string };

    return {
      status: 500,
      message: err.response?.data?.message || err.message,
      jsonResponse: null,
      output: 0,
    };
  };
};
