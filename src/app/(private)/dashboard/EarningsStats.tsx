"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDashboardDataQuery } from "@/lib/features/dashboardApiSlice";

export function EarningsStats() {
  const { data, isLoading } = useGetDashboardDataQuery({});

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
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
    <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pt-3 sm:pt-6">
          <CardTitle className="text-xs font-medium sm:text-sm">
            Total Earnings
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="text-xl font-bold sm:text-2xl">
            {data?.earnings.totalEarnings || 0} BDT
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pt-3 sm:pt-6">
          <CardTitle className="text-xs font-medium sm:text-sm">
            Available Earnings
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="text-xl font-bold sm:text-2xl">
            {data?.earnings.availableEarnings || 0} BDT
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pt-3 sm:pt-6">
          <CardTitle className="text-xs font-medium sm:text-sm">
            Earnings Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="flex justify-between text-xs sm:text-sm">
            <span>From Deposits:</span>
            <span>{data?.earnings.depositEarnings || 0} BDT</span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm">
            <span>From Withdraws:</span>
            <span>{data?.earnings.withdrawEarnings || 0} BDT</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
