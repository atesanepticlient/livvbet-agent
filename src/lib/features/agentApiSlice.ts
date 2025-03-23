import { Prisma } from "@prisma/client";
import { apiSlice } from "./apiSlice";

const agentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchUnVerifiedAgents: builder.query<
      { payload: Prisma.agentGetPayload<object>[] },
      void
    >({
      query: () => ({
        url: `api/agents/pending`,
        method: "GET",
      }),
      providesTags: ["agent"],
    }),
  }),
});

export const { useFetchUnVerifiedAgentsQuery } = agentApiSlice;
