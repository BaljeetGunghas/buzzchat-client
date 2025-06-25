// src/redux/slices/authSlice.ts

import { RegisterForm, User } from '@/app/auth/type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    token: string | null
}

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
};
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        registerRequest(state, action: PayloadAction<RegisterForm>) {
            state.loading = true;
            state.error = null;
        },
        registerSuccess(state, action: PayloadAction<{ user: User | null; token: string }>) {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.loading = false;
        },
        registerFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
    },
});

export const {
    registerRequest,
    registerSuccess,
    registerFailure,
    setLoading,
} = authSlice.actions;

export default authSlice.reducer;
