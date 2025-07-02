import { createSlice } from '@reduxjs/toolkit';

const teamSlice = createSlice({
  name: 'team',
  initialState: {
    selectedTeam: null,
  },
  reducers: {
    setSelectedTeam: (state, action) => {
      state.selectedTeam = action.payload;
    },
    clearSelectedTeam: (state) => {
      state.selectedTeam = null;
    },
  },
});

export const { setSelectedTeam, clearSelectedTeam } = teamSlice.actions;
export default teamSlice.reducer;
