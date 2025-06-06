"use client";

import { DashboardStats } from "./DashboardStats";
import { EarningsStats } from "./EarningsStats";
import { EarningsChart } from "./EarningsChart";

export default function AgentDashboardPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Agent Dashboard</h1>

      <DashboardStats />
      <EarningsStats />
      <EarningsChart />
    </div>
  );
}
