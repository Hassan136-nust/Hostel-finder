import { apiSlice } from "../api/apiSlice";

export const favoritesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFavorites: builder.query({
        query: () => ({
            url: "favorites",
            method: "GET",
        }),
        providesTags: ["Favorites"]
    }),

    checkFavorite: builder.query({
        query: (roomId) => ({
            url: `favorites/check/${roomId}`,
            method: "GET",
        })
    }),

    addToFavorites: builder.mutation({
        query: (data) => ({
            url: "favorites/add",
            method: "POST",
            body: data
        }),
        invalidatesTags: ["Favorites"]
    }),

    removeFromFavorites: builder.mutation({
        query: (roomId) => ({
            url: `favorites/remove/${roomId}`,
            method: "DELETE",
        }),
        invalidatesTags: ["Favorites"]
    })
  }),
});

export const {
    useGetFavoritesQuery,
    useCheckFavoriteQuery,
    useAddToFavoritesMutation,
    useRemoveFromFavoritesMutation
} = favoritesApi;
