import axios from 'axios';
import { RegisterForm, RegisterResponse } from '../auth/type';

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
