import { User } from "../auth/type";
import axiosInstance from "../utils/axiosInstance";

export interface OnlineUsersApiResponse {
    status: number;
    message: string;
    jsonResponse: User[];
    output: number;
}
export interface FriendProfileApiResponse {
    status: number;
    message: string;
    jsonResponse: User | null;
    output: number;
}


export const getOnlineUserProfiles = async (userIds: string[]): Promise<User[]> => {
  try {
    const response = await axiosInstance.post<OnlineUsersApiResponse>(
      "user/status/online",
      { userIds }
    );
    
    return response.data.jsonResponse;
  } catch (error) {
    console.error("Failed to fetch online user profiles", error);
    throw error;
  }
};


export const getFrindProfile = async (friendID : string): Promise<FriendProfileApiResponse> => {
    try {
        const response = await axiosInstance.get<FriendProfileApiResponse>(`user/${friendID}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching online users", error);
        throw error;
    }
};