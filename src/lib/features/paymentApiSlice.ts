import { apiSlice } from "./apiSlice";
import {
  DepositsOutput,
  PaymentDataOutput,
  WithdrawsOutput,
} from "@/types/api";

const agentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchPaymentMethos: builder.query<PaymentDataOutput, void>({
      query: () => ({
        method: "GET",
        url: "/api/payment/methods",
      }),
      providesTags: ["payment"],
    }),

    fetchDeposits: builder.query<DepositsOutput, void>({
      query: () => ({
        url: "/api/payment/deposits",
        method: "GET",
      }),
      providesTags: ["deposit"],
    }),

    fetchWithdraws: builder.query<WithdrawsOutput, void>({
      query: () => ({
        url: "/api/payment/withdraws",
        method: "GET",
      }),
      providesTags: ["withdraw"],
    }),

    updateDeposit: builder.mutation<
      { message: string },
      { change: "accept" | "reject"; id: string }
    >({
      query: ({ change, id }) => ({
        method: "PUT",
        url: `/api/payment/deposits/${id}?change=${change}`,
        body: {},
      }),
      invalidatesTags: ["deposit"],
    }),

    updateWithdraw: builder.mutation<
      { message: string },
      { change: "accept" | "reject"; id: string }
    >({
      query: ({ change, id }) => ({
        method: "PUT",
        url: `/api/payment/withdraws/${id}?change=${change}`,
        body: {},
      }),
      invalidatesTags: ["withdraw"],
    }),

    deleteDeposit: builder.mutation<{ message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/api/payment/deposits/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["deposit"],
    }),

    deleteWithdraw: builder.mutation<{ message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/api/payment/withdraws/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["withdraw"],
    }),
  }),
});

export const {
  useFetchPaymentMethosQuery,
  useFetchDepositsQuery,
  useFetchWithdrawsQuery,
  useUpdateDepositMutation,
  useUpdateWithdrawMutation,
  useDeleteDepositMutation,
  useDeleteWithdrawMutation,
} = agentApiSlice;
