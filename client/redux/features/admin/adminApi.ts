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

    // Toggle featured hostel
    toggleFeaturedHostel: builder.mutation({
      query: (data) => ({
        url: "admin/toggle-featured",
        method: "PUT",
        body: data,
      }),
    }),

    // Get featured hostels (public)
    getFeaturedHostels: builder.query({
      query: () => ({
        url: "admin/featured-hostels",
        method: "GET",
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

    // Get all reviews for moderation
    getAdminReviews: builder.query({
      query: () => ({
        url: "admin/reviews",
        method: "GET",
      }),
    }),

    // Delete review
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `admin/review/${reviewId}`,
        method: "DELETE",
      }),
    }),

    // Get all questions for moderation
    getAdminQuestions: builder.query({
      query: () => ({
        url: "admin/questions",
        method: "GET",
      }),
    }),

    // Delete question
    deleteQuestion: builder.mutation({
      query: (questionId) => ({
        url: `admin/question/${questionId}`,
        method: "DELETE",
      }),
    }),

    // Create announcement
    createAnnouncement: builder.mutation({
      query: (data) => ({
        url: "admin/announcement",
        method: "POST",
        body: data,
      }),
    }),

    // Get all announcements
    getAnnouncements: builder.query({
      query: () => ({
        url: "admin/announcements",
        method: "GET",
      }),
    }),

    // Get active announcements (public)
    getActiveAnnouncements: builder.query({
      query: () => ({
        url: "admin/active-announcements",
        method: "GET",
      }),
    }),

    // Toggle announcement
    toggleAnnouncement: builder.mutation({
      query: (data) => ({
        url: "admin/toggle-announcement",
        method: "PUT",
        body: data,
      }),
    }),

    // Delete announcement
    deleteAnnouncement: builder.mutation({
      query: (announcementId) => ({
        url: `admin/announcement/${announcementId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetAdminHostelsQuery,
  useAdminToggleHostelMutation,
  useToggleFeaturedHostelMutation,
  useGetFeaturedHostelsQuery,
  useGetAdminUsersQuery,
  useGetPendingRequestsQuery,
  useHandleManagerRequestMutation,
  useGetAdminReviewsQuery,
  useDeleteReviewMutation,
  useGetAdminQuestionsQuery,
  useDeleteQuestionMutation,
  useCreateAnnouncementMutation,
  useGetAnnouncementsQuery,
  useGetActiveAnnouncementsQuery,
  useToggleAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = adminApi;

