import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../redux/slices/authSlice';
import teamReducer from '../redux/slices/teamSlice';
import projectReducer from '../redux/slices/projectSlice';
import taskReducer from '../redux/slices/taskSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        team: teamReducer,
        project: projectReducer,
        task:taskReducer
    }
})