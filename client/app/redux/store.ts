import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/api/apiSlice";
import authSlice from "./features/auth/authSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

const initializeApp = async () => {
  try {
    console.log("Initializing app..."); 
    
    const refreshResult = await store.dispatch(
      apiSlice.endpoints.refreshToken.initiate({}, { forceRefetch: true })
    );
    
    console.log("Refresh result:", refreshResult); 
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const loadUserResult = await store.dispatch(
      apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true })
    );
    
    console.log("Load user result:", loadUserResult);
    
  } catch (error: any) {
    console.log("Error during app initialization:", error);
  }
};

if (typeof window !== 'undefined') {
  initializeApp();
}