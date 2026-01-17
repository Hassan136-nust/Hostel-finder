import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userLoggedOut } from "./authSlice";

interface IRegistrationData {
  name: string;
  email: string;
  password: string;
  phone: string; 
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<any, IRegistrationData>({
      query: (data) => ({
        url: "registration",
        method: "POST",
        body: data,
      }),
    }),
    activation: builder.mutation({
      query: (data) => ({
        url: "activate-user",
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "login",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error) {
          // Handle error silently
        }
      },
    }),
    logout: builder.query({
      query: () => ({
        url: "logout",
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(userLoggedOut());
        } catch (error) {
           // Handle error silently
        }
      },
    }),
    loadUser: builder.query({
      query: () => ({
        url: "me",
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error) {
           // Handle error silently
        }
      },
    }),
    refreshToken: builder.query({
      query: () => ({
        url: "refresh",
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error) {
           // Handle error silently
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useActivationMutation,
  useLoginMutation,
  useLogoutQuery,
  useLoadUserQuery,
  useRefreshTokenQuery,
} = authApi;