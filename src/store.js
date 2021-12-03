import { configureStore } from "@reduxjs/toolkit";
import tasks from './reducer/taskReducer';
import user from './reducer/userReducer';

const store = configureStore({
    reducer: {
        tasks,
        user
    }
});

export default store;