export type RegisterForm = {
    name: string;
    email: string;
    password: string;
    phone_number: string;
};

export interface User {
    name: string;
    email: string;
    phone_number: string;
    profile_picture: string;
    status: string;
    date_of_birth: string | null;
    isVerified: boolean;
    _id: string;
    lastLogin: string;
    createdAt: string;
    updatedAt: string;
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    jsonResponse: User | null;
    output: number;
    token: string;
}
