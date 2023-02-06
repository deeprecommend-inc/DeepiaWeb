import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategoryDto } from '../../libs/category/session/dto/category.dto';

interface CategoryState {
    list: CategoryDto[];
    publicList: CategoryDto[];
    categoryIdForGetLog: number;
}

const initialState: CategoryState = {
    list: [],
    publicList: [],
    categoryIdForGetLog: null,
};

export const logSlice = createSlice({
    name: 'log',
    initialState,
    reducers: {
        setCategoryList: (state, action: PayloadAction<CategoryDto[]>) => {
            state.list = action.payload;
        },
        setPublicCategoryList: (
            state,
            action: PayloadAction<CategoryDto[]>,
        ) => {
            state.publicList = action.payload;
        },
        setCategoryIdForGetLog: (state, action: PayloadAction<number>) => {
            state.categoryIdForGetLog = action.payload;
        },
    },
});

export const {
    setCategoryList,
    setPublicCategoryList,
    setCategoryIdForGetLog,
} = logSlice.actions;

export default logSlice.reducer;
