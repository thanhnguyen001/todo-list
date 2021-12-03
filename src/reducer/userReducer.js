import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("user")) || null

const user = createSlice({
    name: "user",
    initialState,
    reducers: {
        signIn: (state, action) => {
            localStorage.setItem("user", JSON.stringify(action.payload));
            return state = { ...action.payload }
        },
        logout: (state, action) => {
            localStorage.removeItem("user");
            localStorage.removeItem("tasks");
            state = null;
            return state
        }
    }
});

export const { signIn, logout } = user.actions;
export default user.reducer;