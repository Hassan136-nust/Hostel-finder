import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
    prepareHeaders: (headers) => {
        return headers;
    },
    credentials: "include", 
  }),
  tagTypes: ["User"], 
  endpoints: (builder) => ({}),
});