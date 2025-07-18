import axiosInstance from "../utils/axiosInstance";
import { ChatMessage, GetMessagesResponse, SendMessageResponse } from "./types/message";



export const fetchMessages = async (
  conversationId: string
): Promise<ChatMessage[]> => {
  const res = await axiosInstance.get<GetMessagesResponse>(
    `messages/${conversationId}`
  );
  return res.data.jsonResponse;
};
export const sendMessage = async (payload: {
  senderId: string;
  receiverId: string;
  content: string;
}): Promise<SendMessageResponse> => {
  const res = await axiosInstance.post("messages/send", payload);
  return res.data;
};