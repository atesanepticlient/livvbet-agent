"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDashboardDataQuery } from "@/lib/features/dashboardApiSlice";

export function DashboardStats() {
  const { data, isLoading } = useGetDashboardDataQuery({});

  if (isLoading) {
    return (
      <div className="grid gap-3 grid-cols-2 sm:gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="p-3 sm:p-6">
              <CardTitle>
                <Skeleton className="h-5 w-3/4 sm:h-6" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <Skeleton className="h-7 w-full sm:h-8" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 grid-cols-2 sm:gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="">
          <CardTitle className="text-xs font-medium sm:text-sm">
            Total Users
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="text-xl font-bold sm:text-2xl">
            {data?.statistics.totalUsers || 0}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-xs font-medium sm:text-sm">
            Account Balance
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="text-xl font-bold sm:text-2xl">
            {Number(data?.statistics.accountBalance || 0).toFixed(2)}{" "}
            {data?.statistics.currencyCode || "USD"}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader >
          <CardTitle className="text-xs font-medium sm:text-sm">
            Total Deposits
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="text-xl font-bold sm:text-2xl">
            {Number(data?.statistics.totalDeposits || 0).toFixed(2)}{" "}
            {data?.statistics.currencyCode || "USD"}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader >
          <CardTitle className="text-xs font-medium sm:text-sm">
            Total Withdraws
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="text-xl font-bold sm:text-2xl">
            {Number(data?.statistics.totalWithdraws || 0).toFixed(2)}{" "}
            {data?.statistics.currencyCode || "USD"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
