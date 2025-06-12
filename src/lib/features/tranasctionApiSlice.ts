import { apiSlice } from "./apiSlice";
import { TransactionResponse } from "@/types/api";

const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query<
      TransactionResponse,
      {
        page?: number;
        limit?: number;
        type?: "deposit" | "withdraw";
        search?: string;
        startDate?: string;
        endDate?: string;
      }
    >({
      query: (params) => ({
        url: "/api/transctions-records",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.type && { type: params.type }),
          ...(params.search && { search: params.search }),
          ...(params.startDate && { startDate: params.startDate }),
          ...(params.endDate && { endDate: params.endDate }),
        },
      }),
      providesTags: ["Transactions"],
    }),
  }),
});

export const { useGetTransactionsQuery } = dashboardApiSlice;
