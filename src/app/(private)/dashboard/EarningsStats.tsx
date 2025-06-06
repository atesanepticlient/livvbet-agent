// components/agent/EarningsStats.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDashboardDataQuery } from "@/lib/features/dashboardApiSlice";

export function EarningsStats() {
  const { data, isLoading } = useGetDashboardDataQuery({});

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.earnings.totalEarnings || 0} BDT
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Available Earnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.earnings.availableEarnings || 0} BDT
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Earnings Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>From Deposits:</span>
            <span>{data?.earnings.depositEarnings || 0} BDT</span>
          </div>
          <div className="flex justify-between">
            <span>From Withdraws:</span>
            <span>{data?.earnings.withdrawEarnings || 0} BDT</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
