import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDto } from '../../libs/user/session/dto/user.dto';

interface UserState {
    following: UserDto[];
}

const initialState: UserState = {
    following: [],
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setFollowings: (state, action: PayloadAction<UserDto[]>) => {
            state.following = action.payload;
        },
    },
});

export const { setFollowings } = userSlice.actions;

export default userSlice.reducer;
