'use client';
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/api/apiSlice";
import authSlice from "./features/auth/authSlice";
import { authApi } from "./features/auth/authApi";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
  },
  devTools: false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

const initializeApp = async () => {
  const state = store.getState();
  
  if (state.auth.user && state.auth.token) {
    try {
      await store.dispatch(
        authApi.endpoints.refreshToken.initiate(undefined, { forceRefetch: true })
      );
      
      await store.dispatch(
        authApi.endpoints.loadUser.initiate(undefined, { forceRefetch: true })
      );
    } catch (error) {
      
    }
  }
};

if (typeof window !== 'undefined') {
  setTimeout(() => {
    initializeApp();
  }, 100);
}