"use client";

import { DashboardStats } from "./DashboardStats";
import { EarningsStats } from "./EarningsStats";
import { EarningsChart } from "./EarningsChart";

export default function AgentDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-4 space-y-6 sm:py-8 sm:space-y-8">
      <h1 className="text-2xl font-bold sm:text-3xl">Agent Dashboard</h1>

      <DashboardStats />
      <EarningsStats />
      <EarningsChart />
    </div>
  );
}
