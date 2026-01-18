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
    hostelRequestStatus?: "none" | "pending" | "approved" | "rejected";
}

interface IAuthState {
  token: string;
  user: IUser | null;
}

const loadState = (): IAuthState => {
    if (typeof window === 'undefined') {
        return { token: "", user: null };
    }
    try {
        const serializedState = localStorage.getItem('authState');
        if (serializedState === null) {
            return { token: "", user: null };
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return { token: "", user: null };
    }
};

const saveState = (state: IAuthState) => {
    if (typeof window === 'undefined') return;
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('authState', serializedState);
    } catch (err) {
        console.error('Could not save state', err);
    }
};

const initialState: IAuthState = loadState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegistration: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      saveState(state);
    },
    userLoggedIn: (state, action: PayloadAction<{ accessToken: string; user: IUser }>) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      saveState(state);
    },
    userLoggedOut: (state) => {
      state.token = "";
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authState');
      }
    },
  },
});

export const { userRegistration, userLoggedIn, userLoggedOut } = authSlice.actions;

export default authSlice.reducer;