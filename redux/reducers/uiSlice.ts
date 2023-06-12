import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
    tabNum: number;
    loading: boolean;
    iFrames: string[];
    dark: boolean;
}

const initialState: UiState = {
    tabNum: 0,
    loading: false,
    iFrames: [],
    dark: false,
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        updateTabNum: (state, action: PayloadAction<number>) => {
            state.tabNum = action.payload;
        },
        updateLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setIFrames: (state, action: PayloadAction<string[]>) => {
            state.iFrames = action.payload;
        },
        setDark: (state, action: PayloadAction<boolean>) => {
            state.dark = action.payload;
        },
    },
});

export const { updateTabNum, updateLoading, setIFrames, setDark } =
    uiSlice.actions;

export default uiSlice.reducer;
