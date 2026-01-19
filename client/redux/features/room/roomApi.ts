import { apiSlice } from "../api/apiSlice";

export const roomApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createRoom: builder.mutation({
      query: (data) => ({
        url: "create-room",
        method: "POST",
        body: data,
      }),
    }),
    
    getHostelRooms: builder.query({
      query: (hostelId) => ({
        url: `hostel-rooms/${hostelId}`,
        method: "GET",
      }),
    }),

    updateRoom: builder.mutation({
      query: ({ id, data }) => ({
        url: `update-room/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    deleteRoom: builder.mutation({
      query: (id) => ({
        url: `delete-room/${id}`,
        method: "DELETE",
      }),
    }),

    toggleRoomAvailability: builder.mutation({
      query: (id) => ({
        url: `toggle-availability/${id}`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useCreateRoomMutation,
  useGetHostelRoomsQuery,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useToggleRoomAvailabilityMutation,
} = roomApi;

