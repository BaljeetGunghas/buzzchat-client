// types/message.ts

export interface ChatMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SendMessageResponse {
  status: number;
  message: string;
  jsonResponse: {
    message: ChatMessage;
    conversationId: string;
  };
  output: number;
}



export interface ChatMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetMessagesResponse {
  status: number;
  message: string;
  jsonResponse: ChatMessage[];
  output: number;
}
