import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../redux/slices/authSlice';
import teamReducer from '../redux/slices/teamSlice';
import projectReducer from '../redux/slices/projectSlice'
export const store = configureStore({
    reducer: {
        auth: authReducer,
        team: teamReducer,
        project: projectReducer
    }
})