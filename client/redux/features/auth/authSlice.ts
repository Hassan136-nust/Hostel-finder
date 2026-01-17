import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUser {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    avatar?: {
        public_id: string;
        url: string;
    };
}

interface IAuthState {
  token: string;
  user: IUser | null;
}

const initialState: IAuthState = {
  token: "",
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegistration: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    userLoggedIn: (state, action: PayloadAction<{ accessToken: string; user: IUser }>) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
    },
    userLoggedOut: (state) => {
      state.token = "";
      state.user = null;
    },
  },
});

export const { userRegistration, userLoggedIn, userLoggedOut } = authSlice.actions;

export default authSlice.reducer;