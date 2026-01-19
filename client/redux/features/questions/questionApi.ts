import { apiSlice } from "../api/apiSlice";

export const questionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Ask question
    askQuestion: builder.mutation({
        query: (data) => ({
            url: "ask-question",
            method: "POST",
            body: data
        })
    }),

    // Answer question
    answerQuestion: builder.mutation({
        query: (data) => ({
            url: "answer-question",
            method: "PUT", 
            body: data
        })
    }),

    // Get hostel questions
    getHostelQuestions: builder.query({
        query: (hostelId) => ({
            url: `get-hostel-questions/${hostelId}`,
            method: "GET"
        })
    }),

    // Get user's own questions
    getMyQuestions: builder.query({
        query: () => ({
            url: "my-questions",
            method: "GET"
        })
    })
  }),
});

export const {
    useAskQuestionMutation,
    useAnswerQuestionMutation,
    useGetHostelQuestionsQuery,
    useGetMyQuestionsQuery
} = questionApi;

