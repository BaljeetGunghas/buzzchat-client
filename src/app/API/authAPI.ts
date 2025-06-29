import axios from 'axios';
import { LoginForm, LoginResponse, RegisterForm, RegisterResponse } from '../auth/type';

export const registerUser = async (data: RegisterForm): Promise<RegisterResponse> => {
  try {
    const response = await axios.post<RegisterResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}auth/register`,
      data,
      { withCredentials: true }
    );
    return response.data;  // <-- only the data, not the full response
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
      jsonResponse: null,
      output: 0,
      token: '',
    };
  }
};

export const loginUser = async (data: LoginForm): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}auth/login`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
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
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}auth/logoutUser`,
      {},
      { withCredentials: true }
    );

    return {
      success: true,
      message: response.data?.message || 'Logout successful',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};


interface ResSetPasswordResponse {
  status: number,
  message: string,
  jsonResponse: null,
  output: number
}


export const resetPassword = async (email: string): Promise<ResSetPasswordResponse> => {
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
  } catch (error: any) {
    const message =
      error.response?.data?.message || 'Failed to request password reset';
    const status = error.response?.status || 500;

    return {
      status,
      message,
      jsonResponse: null,
      output: 0,
    };
  }
};