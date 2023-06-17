import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDto } from '../../libs/user/session/dto/user.dto';

interface UserState {
    detail: UserDto;
    following: UserDto[];
}

const initialState: UserState = {
    detail: {
        id: 0,
        name: '',
        username: '',
        bio: '',
        email: '',
        image: '',
    },
    following: [],
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setDetail: (state, action: PayloadAction<UserDto>) => {
            state.detail = action.payload;
        },
        setFollowings: (state, action: PayloadAction<UserDto[]>) => {
            state.following = action.payload;
        },
    },
});

export const { setDetail, setFollowings } = userSlice.actions;

export default userSlice.reducer;
