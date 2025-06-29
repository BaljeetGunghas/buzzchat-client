import { User } from "@/app/auth/type"; // Assuming this already exists

export interface Conversation {
  _id: string;
  participants: User[];
  createdAt: string;
  updatedAt: string;
}

export interface GetConversationsResponse {
  status: number;
  message: string;
  jsonResponse: Conversation[];
  output: number;
}

export interface ChatListJsonResponse {
  _id: string;
  participants: User;
  lastMessage: string | null;
  lastMessageTime: string;
  isRead: boolean;
  sentByMe: boolean;
}

export interface GetConversationChatListResponse {
  status: number;
  message: string;
  jsonResponse: ChatListJsonResponse[];
  output: number;
}