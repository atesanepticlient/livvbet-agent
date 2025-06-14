"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { useGetDashboardDataQuery } from "@/lib/features/dashboardApiSlice";
import { useState } from "react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EarningsChart() {
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const { data, isLoading, refetch } = useGetDashboardDataQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const handleApplyFilter = () => {
    refetch();
  };

  if (isLoading) {
    return <Skeleton className="h-60 w-full sm:h-80" />;
  }

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:gap-5 sm:flex-row sm:items-center">
          <CardTitle className="text-lg sm:text-xl">
            Earnings Over Time
          </CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="grid grid-cols-2 gap-2 w-full ">
              <DatePicker
                selected={
                  dateRange.startDate
                    ? new Date(dateRange.startDate)
                    : undefined
                }
                onSelect={(date) =>
                  setDateRange({
                    ...dateRange,
                    startDate: date?.toISOString() || "",
                  })
                }
                placeholder="Start Date"
                className="w-full sm:w-auto"
              />
              <DatePicker
                selected={
                  dateRange.endDate ? new Date(dateRange.endDate) : undefined
                }
                onSelect={(date) =>
                  setDateRange({
                    ...dateRange,
                    endDate: date?.toISOString() || "",
                  })
                }
                placeholder="End Date"
                className="w-full sm:w-auto"
              />
            </div>
            <Button onClick={handleApplyFilter} className="w-full sm:w-auto">
              Apply
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <div className="h-60 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.chartData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(new Date(date), "MMM dd")}
                tick={{ fontSize: 10 }}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => `৳${value}`}
              />
              <Tooltip
                formatter={(value) => [`৳${value}`, "Earnings"]}
                labelFormatter={(date) => format(new Date(date), "PPP")}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#8884d8"
                activeDot={{ r: 6 }}
                name="Earnings (BDT)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
