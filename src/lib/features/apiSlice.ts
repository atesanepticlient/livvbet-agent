import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({ baseUrl: "/" });

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQuery,
  tagTypes: [
    "agent",
    "user",
    "payment",
    "deposit",
    "withdraw",
    "Transactions",
    "Withdraws",
    "dashboard",
  ],
  endpoints: () => ({}),
});
