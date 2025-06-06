import { apiSlice } from "./apiSlice";

const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPendingWithdraws: builder.query({
      query: (params: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
      }) => ({
        url: "/api/withdraws/pending",
        params,
      }),
      providesTags: ["Withdraws"],
    }),
    completeWithdraw: builder.mutation({
      query: (id) => ({
        url: `/api/withdraws/${id}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: ["Withdraws"],
    }),
  }),
});

export const { useGetPendingWithdrawsQuery, useCompleteWithdrawMutation } =
  dashboardApiSlice;
