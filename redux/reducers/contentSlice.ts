import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContentDto } from "../../libs/content/session/dto/content.dto";

interface ContentState {
  list: ContentDto[];
  selected: ContentDto[];
  recommendation: string[];
}

const initialState: ContentState = {
  list: [],
  selected: [],
  recommendation: [],
};

export const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setContentList: (state, action: PayloadAction<ContentDto[]>) => {
      state.list = action.payload;
    },
    setSelectedContents: (state, action: PayloadAction<ContentDto[]>) => {
      state.selected = action.payload;
    },
  },
});

export const { setContentList, setSelectedContents } = contentSlice.actions;

export default contentSlice.reducer;
