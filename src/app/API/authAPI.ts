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
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message: string };

    return {
      success: false,
      message: err.response?.data?.message || err.message,
      jsonResponse: null,
      output: 0,
      token: '',
    };
  };
};

export const loginUser = async (data: LoginForm): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}auth/login`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message: string };

    return {
      success: false,
      message: err.response?.data?.message || err.message,
      jsonResponse: null,
      output: 0,
      token: '',
    };
  };
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
   } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message: string };

    return {
      success: false,
      message: err.response?.data?.message || err.message,
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