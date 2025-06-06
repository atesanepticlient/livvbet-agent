import { apiSlice } from "./apiSlice";
import { UsersDataOutput, UsersFetchInput } from "@/types/api";

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchUsers: builder.query<UsersDataOutput, UsersFetchInput>({
      query: (params) => ({
        method: "GET",
        url: `/api/users?search=${params.search}&status=${params.status}&page=${params.page}&limit=${params.limit}`,
      }),
      providesTags: ["user"],
    }),
  }),
});

export const { useFetchUsersQuery } = userApiSlice;
