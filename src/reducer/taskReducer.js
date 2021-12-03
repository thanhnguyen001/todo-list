import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import uniqid from 'uniqid';

const initialState = JSON.parse(localStorage.getItem("tasks")) || [];

const tasks = createSlice({
    initialState,
    name: "tasks",
    reducers: {
        addAllTasks: (state, action) => {
            state = [...action.payload];
            state.sort((a, b) => {
                if (moment(a.dueDate).isBefore(moment(b.dueDate))) return -1;
                else return 1;
            });

            localStorage.setItem("tasks", JSON.stringify(state));
            return state;
        },
        addOrUpdateTask: (state, action) => {

            if (action.payload.isUpdate) {
                const index = state.findIndex(item => item.id === action.payload.id);
                state[index] = { ...action.payload, isUpdate: false };
            }
            else state.push({ ...action.payload, id: uniqid.time() });

            state.sort((a, b) => {
                if (moment(a.dueDate).isBefore(moment(b.dueDate))) return -1;
                else return 1;
            });

            localStorage.setItem("tasks", JSON.stringify(state));
            return state;
        },
        removeTask: (state, action) => {
            const index = state.findIndex(item => item.id === action.payload.id);
            state.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(state));
            return state;
        },
        removeMultiTasks: (state, action) => {
            const newState = state.filter((item) => !action.payload.includes(item.id));
            localStorage.setItem("tasks", JSON.stringify(newState));
            return newState;
        }
    }
});

export const { addOrUpdateTask, removeTask, removeMultiTasks, addAllTasks } = tasks.actions;
export default tasks.reducer;