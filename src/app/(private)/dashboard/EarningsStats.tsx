"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDashboardDataQuery } from "@/lib/features/dashboardApiSlice";
import BonusClaim from "./BonusClaim";

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
        <CardHeader>
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
        <CardHeader>
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
      <Card className="relative">
        <CardHeader>
          <CardTitle className="text-xs font-medium sm:text-sm">
            Earnings Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="flex justify-between text-xs sm:text-sm">
            <span>From Deposits:</span>
            <span>{data?.earnings.totalAvailDeposit || 0} BDT</span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm">
            <span>From Withdraws:</span>
            <span>{data?.earnings.totalAvailWithdraw || 0} BDT</span>
          </div>
          <BonusClaim
            data={{
              deEarning: data?.earnings.totalAvailDeposit,
              wdEarning: data?.earnings.totalAvailWithdraw,
            }}
          >
            <Button
              size={"sm"}
              variant={"secondary"}
              className="absolute right-2 top-2"
            >
              Claim
            </Button>
          </BonusClaim>
        </CardContent>
      </Card>
    </div>
  );
}
