import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LogDto } from '../../libs/log/session/dto/log.dto';

interface LogState {
    list: LogDto[];
    selected: LogDto[];
    recommendation: string[];
}

const initialState: LogState = {
    list: [],
    selected: [],
    recommendation: [],
};

export const logSlice = createSlice({
    name: 'log',
    initialState,
    reducers: {
        setLogList: (state, action: PayloadAction<LogDto[]>) => {
            state.list = action.payload;
        },
        setSelectedLogs: (state, action: PayloadAction<LogDto[]>) => {
            state.selected = action.payload;
        },
    },
});

export const { setLogList, setSelectedLogs } = logSlice.actions;

export default logSlice.reducer;
