// components/agent/DashboardStats.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDashboardDataQuery } from "@/lib/features/dashboardApiSlice";

export function DashboardStats() {
  const { data, isLoading } = useGetDashboardDataQuery({});

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-3/4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.statistics.totalUsers || 0}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Number(data?.statistics.accountBalance || 0).toFixed(2)}{" "}
            {data?.statistics.currencyCode || "USD"}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Number(data?.statistics.totalDeposits || 0).toFixed(2)}{" "}
            {data?.statistics.currencyCode || "USD"}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Withdraws</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Number(data?.statistics.totalWithdraws || 0).toFixed(2)}{" "}
            {data?.statistics.currencyCode || "USD"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
