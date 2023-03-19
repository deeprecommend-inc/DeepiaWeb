import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import uiReducer from './reducers/uiSlice';
import contentReducer from './reducers/contentSlice';
import userReducer from './reducers/userSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        content: contentReducer,
        user: userReducer,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
