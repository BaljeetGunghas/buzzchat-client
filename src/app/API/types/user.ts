import { User } from "@/app/auth/type";

export interface SearchUserResponse {
  success: boolean;
  message: string;
  jsonResponse: User[] | null;
  output: number;
}