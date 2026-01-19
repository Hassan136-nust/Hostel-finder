import { apiSlice } from "../api/apiSlice";

export const hostelApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create new hostel
    createHostel: builder.mutation({
      query: (data) => ({
        url: "create-hostel",
        method: "POST",
        body: data,
      }),
    }),
    
    // Get all hostels (public)
    getAllHostels: builder.query({
      query: () => ({
        url: "hostels",
        method: "GET",
      }),
    }),

    // Get my hostel details (manager)
    getMyHostel: builder.query({
        query: () => ({
            url: "get-my-hostel",
            method: "GET",
        })
    }),

    // Get single hostel by ID (public)
    getHostelById: builder.query({
        query: (id) => ({
            url: `hostel/${id}`,
            method: "GET",
        })
    }),

    // Update hostel details
    updateHostel: builder.mutation({
      query: ({ id, data }) => ({
        url: `update-hostel/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    // Toggle hostel active status
    toggleHostelStatus: builder.mutation({
      query: (data) => ({
        url: "toggle-hostel-status",
        method: "PUT",
        body: data,
      }),
    }),

    // Delete hostel
    deleteHostel: builder.mutation({
      query: (id) => ({
        url: `delete-hostel/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateHostelMutation,
  useGetAllHostelsQuery,
  useGetMyHostelQuery,
  useGetHostelByIdQuery,
  useUpdateHostelMutation,
  useToggleHostelStatusMutation,
  useDeleteHostelMutation,
} = hostelApi;

