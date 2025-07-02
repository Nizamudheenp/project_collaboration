import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../redux/slices/authSlice';
import teamReducer from '../redux/slices/teamSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        team: teamReducer,
    }
})