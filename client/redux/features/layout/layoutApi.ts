import { apiSlice } from "../api/apiSlice";

export const layoutApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createLayout: builder.mutation({
      query: (body) => ({
        url: "create-layout",
        method: "POST",
        body,
      }),
    }),
    editLayout: builder.mutation({
      query: (body) => ({
        url: "edit-layout",
        method: "PUT",
        body,
      }),
    }),
    getLayout: builder.query({
      query: (type) => ({
        url: `get-layout?type=${type}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateLayoutMutation, useEditLayoutMutation, useGetLayoutQuery } = layoutApi;
