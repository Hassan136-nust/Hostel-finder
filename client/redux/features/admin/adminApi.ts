import { apiSlice } from "../api/apiSlice";

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get admin stats
    getAdminStats: builder.query({
      query: () => ({
        url: "admin/stats",
        method: "GET",
      }),
    }),

    // Get all hostels for admin
    getAdminHostels: builder.query({
      query: () => ({
        url: "admin/hostels",
        method: "GET",
      }),
    }),

    // Toggle hostel status (admin)
    adminToggleHostel: builder.mutation({
      query: (data) => ({
        url: "admin/toggle-hostel",
        method: "PUT",
        body: data,
      }),
    }),

    // Get all users
    getAdminUsers: builder.query({
      query: () => ({
        url: "admin/users",
        method: "GET",
      }),
    }),

    // Get pending manager requests
    getPendingRequests: builder.query({
      query: () => ({
        url: "admin/pending-requests",
        method: "GET",
      }),
    }),

    // Handle manager request (approve/reject)
    handleManagerRequest: builder.mutation({
      query: (data) => ({
        url: "admin/handle-request",
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetAdminHostelsQuery,
  useAdminToggleHostelMutation,
  useGetAdminUsersQuery,
  useGetPendingRequestsQuery,
  useHandleManagerRequestMutation,
} = adminApi;
