import { apiSlice } from "./apiSlice";

const earnningApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWithdrawalRequests: builder.query({
      query: ({ page = 1, limit = 10, status }) =>
        `/api/earnning?page=${page}&limit=${limit}${
          status ? `&status=${status}` : ""
        }`,
      providesTags: ["earnning"],
    }),

    createEarnningReqs: builder.mutation({
      query: (body) => ({
        url: "/api/earnning",
        method: "POST",
        body,
      }),
      invalidatesTags: ["earnning", "dashboard"],
    }),
  }),
});

export const { useGetWithdrawalRequestsQuery, useCreateEarnningReqsMutation } =
  earnningApiSlice;
