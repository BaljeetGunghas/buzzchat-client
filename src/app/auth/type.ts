export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  phone_number: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone_number: string;
  profile_picture: string;
  status: string;
  isVerified: boolean;
  gender: "M" | "F" | null; // Gender can be "M", "F", or null
  date_of_birth?: string;   // Optional if not always present
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  jsonResponse: User | null;
  output: number;
  token: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  jsonResponse: User | null;
  output: number;
  token: string;
}