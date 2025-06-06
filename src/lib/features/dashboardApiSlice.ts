import { apiSlice } from "./apiSlice";
import { ActivityDataOutput, StatisticsDataOutput } from "@/types/api";

const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchStatistics: builder.query<StatisticsDataOutput, void>({
      query: () => ({
        method: "GET",
        url: "/api/dashboard/statistics",
      }),
    }),

    fetchActivity: builder.query<ActivityDataOutput, void>({
      query: () => ({
        method: "GET",
        url: "/api/dashboard/activity",
      }),
    }),

    getDashboardData: builder.query({
      query: (params: { startDate?: string; endDate?: string }) => ({
        url: "/api/dashboard",
        params,
      }),
      providesTags: ["dashboard"],
    }),
  }),
});

export const {
  useFetchStatisticsQuery,
  useFetchActivityQuery,
  useGetDashboardDataQuery,
} = dashboardApiSlice;
