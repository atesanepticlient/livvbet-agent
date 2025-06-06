// components/agent/EarningsChart.tsx
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
    return <Skeleton className="h-80 w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex gap-5 items-center">
          <CardTitle>Earnings Over Time</CardTitle>
          <div className="flex gap-2">
            <DatePicker
              selected={
                dateRange.startDate ? new Date(dateRange.startDate) : undefined
              }
              onSelect={(date) =>
                setDateRange({
                  ...dateRange,
                  startDate: date?.toISOString() || "",
                })
              }
              placeholder="Start Date"
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
            />
            <Button onClick={handleApplyFilter}>Apply</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.chartData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(new Date(date), "MMM dd")}
              />
              <YAxis />
              <Tooltip
                formatter={(value) => [`$${value}`, "Earnings"]}
                labelFormatter={(date) => format(new Date(date), "PPP")}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                name="Earnings"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
