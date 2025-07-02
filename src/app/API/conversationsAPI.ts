import axiosInstance from "../utils/axiosInstance";
import { Conversation, GetConversationChatListResponse, GetConversationsResponse } from "./types/conversation";


export const fetchUserConversations = async (
    userId: string
): Promise<Conversation[]> => {
    const res = await axiosInstance.get<GetConversationsResponse>(
        `conversations/${userId}`
    );
    return res.data.jsonResponse;
};


export const getUserConversationsChatList = async (
    userId: string
): Promise<GetConversationChatListResponse> => {
    const res = await axiosInstance.get<GetConversationChatListResponse>(
        `conversations/chat-list/${userId}`
    );
    return res.data;
};

