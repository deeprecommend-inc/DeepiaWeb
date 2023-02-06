import { configureStore } from '@reduxjs/toolkit';
import logReducer from './reducers/logSlice';
import authReducer from './reducers/authSlice';
import uiReducer from './reducers/uiSlice';
import categoryReducer from './reducers/categorySlice';

const store = configureStore({
    reducer: {
        log: logReducer,
        auth: authReducer,
        ui: uiReducer,
        category: categoryReducer,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
