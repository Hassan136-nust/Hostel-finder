import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: {
    public_id: string;
    url: string;
  };
}

interface AuthState {
  token: string;
  user: User | string;
}

const initialState: AuthState = {
  token: "",
  user: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegistration: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    userLoggedIn: (state, action: PayloadAction<{ accessToken: string; user: User }>) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
    },
    userLoggedOut: (state) => {
      state.token = "";
      state.user = "";
    },
  },
});

export const { userRegistration, userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;