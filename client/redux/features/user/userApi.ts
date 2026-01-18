'use client';
import { apiSlice } from "../api/apiSlice";
import { userLoggedIn } from "../auth/authSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateUserInfo: builder.mutation({
      query: (data) => ({
        url: "update-user-info",
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch, getState }) {
        try {
          const result = await queryFulfilled;
          const state = getState() as any;
          dispatch(
            userLoggedIn({
              accessToken: state.auth.token,
              user: result.data.user,
            })
          );
        } catch (error) {}
      },
    }),
    updateAvatar: builder.mutation({
      query: (data) => ({
        url: "update-avatar",
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch, getState }) {
        try {
          const result = await queryFulfilled;
          const state = getState() as any;
          dispatch(
            userLoggedIn({
              accessToken: state.auth.token,
              user: result.data.user,
            })
          );
        } catch (error) {}
      },
    }),
    requestHostelAccess: builder.mutation({
      query: () => ({
        url: "request-hostel",
        method: "PUT",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch, getState }) {
        try {
          const result = await queryFulfilled;
          const state = getState() as any;
          dispatch(
            userLoggedIn({
              accessToken: state.auth.token,
              user: result.data.user,
            })
          );
        } catch (error) {}
      },
    }),
  }),
});

export const {
  useUpdateUserInfoMutation,
  useUpdateAvatarMutation,
  useRequestHostelAccessMutation,
} = userApi;
