import { apiSlice } from "../api/apiSlice";

export const roomApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create new room
    createRoom: builder.mutation({
      query: (data) => ({
        url: "create-room",
        method: "POST",
        body: data,
      }),
    }),
    
    // Get all rooms for a hostel
    getHostelRooms: builder.query({
      query: (hostelId) => ({
        url: `get-hostel-rooms/${hostelId}`,
        method: "GET",
      }),
    }),

    // Update room details (Placeholder - Endpoint needs implementation in backend if not exists)
    // Assuming backend will have update-room/:id route
    updateRoom: builder.mutation({
      query: ({ id, data }) => ({
        url: `update-room/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    // Delete room (Placeholder - Endpoint needs implementation in backend if not exists)
     // Assuming backend will have delete-room/:id route
    deleteRoom: builder.mutation({
      query: (id) => ({
        url: `delete-room/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateRoomMutation,
  useGetHostelRoomsQuery,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} = roomApi;
