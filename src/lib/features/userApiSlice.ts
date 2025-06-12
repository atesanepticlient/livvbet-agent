import { UsersDataOutput, UsersFetchInput } from "@/types/api";
import { apiSlice } from "./apiSlice";
interface User {
  id: string;
  email: string;
  playerId: string;
  firstName: string;
  lastName: string;
  isBanned: boolean;
  createdAt: string;
  totalDeposit: number;
  totalWithdraw: number;
  _count: {
    deposits: number;
    withdraws: number;
  };
}

interface Pagination {
  total: number;
  page: number;
  totalPages: number;
}

interface UsersResponse {
  users: User[];
  pagination: Pagination;
}
const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAgentUsers: builder.query<
      UsersResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search = "" }) =>
        `/api/users?page=${page}&limit=${limit}&search=${search}`,
    }),

    fetchAllUsers: builder.query<UsersDataOutput, UsersFetchInput>({
      query: (params) => ({
        method: "GET",
        url: `/api/users/all?search=${params.search}&status=${params.status}&page=${params.page}&limit=${params.limit}`,
      }),
      providesTags: ["user"],
    }),
  }),
});

export const { useGetAgentUsersQuery, useFetchAllUsersQuery } = userApiSlice;
