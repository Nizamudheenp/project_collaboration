import { createSlice } from '@reduxjs/toolkit';


const taskSlice = createSlice({
    name: 'project',
    initialState :{
        selectedTask: null,
    },
    reducers: {
        setSelectedTask: (state, action) => {
            state.selectedTask = action.payload;
        },
        clearSelectedTask: (state) => {
            state.selectedTask = null;
        },
    }

});




export const { setSelectedTask, clearSelectedTask } = taskSlice.actions;
export default taskSlice.reducer;
