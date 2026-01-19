import { apiSlice } from "../api/apiSlice";

export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Add review
    addReview: builder.mutation({
        query: (data) => ({
            url: "add-review",
            method: "POST",
            body: data
        })
    }),

    // Get hostel reviews
    getHostelReviews: builder.query({
        query: (hostelId) => ({
            url: `get-reviews/${hostelId}`,
            method: "GET"
        })
    }),

    // Reply to review
    replyToReview: builder.mutation({
        query: (data) => ({
            url: "reply-review",
            method: "PUT", 
            body: data
        })
    })
  }),
});

export const {
    useAddReviewMutation,
    useGetHostelReviewsQuery,
    useReplyToReviewMutation
} = reviewApi;
