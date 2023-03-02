import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthCurrentUserDto } from "../../libs/auth/session/dto/auth.current.user.dto";

interface AuthState {
  isAfterLogin: boolean;
  currentUser: AuthCurrentUserDto | null;
}

const initialState: AuthState = {
  isAfterLogin: false,
  currentUser: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<AuthCurrentUserDto>) => {
      state.currentUser = action.payload;
    },
    updateIsAfterLogin: (state, action: PayloadAction<boolean>) => {
      state.isAfterLogin = action.payload;
    },
  },
});

export const { updateIsAfterLogin, setCurrentUser } = authSlice.actions;

export default authSlice.reducer;
