// app/api/agent/dashboard/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { findAgentFromSession } from "@/data/agent";

export async function GET(request: Request) {
  try {
    const agent = await findAgentFromSession();
    if (!agent) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const site = await db.site.findFirst({
      where: {},
      select: { agentWithdrawEarning: true, agentDepositEarning: true },
    });

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Date filter for queries
    const dateFilter = {
      ...(startDate &&
        endDate && {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
    };

    const [
      totalUsers,
      agentWallet,
      totalDeposits,
      totalWithdraws,
      depositRecords,
      withdrawRecords,
    ] = await Promise.all([
      // Total connected users
      db.users.count({
        where: {
          agentId: agent.id,
        },
      }),

      // Agent wallet balance
      db.agentWallet.findUnique({
        where: {
          agentId: agent.id,
        },
        select: {
          balance: true,
          currencyCode: true,
        },
      }),

      // Total deposit amount
      db.agentDepositRecord.aggregate({
        where: {
          agentId: agent.id,
          ...dateFilter,
        },
        _sum: {
          amount: true,
        },
      }),

      // Total withdraw amount
      db.agentWithdrawRecord.aggregate({
        where: {
          agentId: agent.id,
          ...dateFilter,
        },
        _sum: {
          amount: true,
        },
      }),

      // Deposit records for earnings calculation
      db.agentDepositRecord.findMany({
        where: {
          agentId: agent.id,
          ...dateFilter,
        },
        select: {
          amount: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),

      // Withdraw records for earnings calculation
      db.agentWithdrawRecord.findMany({
        where: {
          agentId: agent.id,
          ...dateFilter,
        },
        select: {
          amount: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
    ]);

    const totalDepositPayouts =
      (
        await db.agentEarningWithdrawReq.aggregate({
          where: { agentId: agent.id },
          _sum: {
            dpAmount: true,
          },
        })
      )._sum.dpAmount || 0;

    const totalWithdarwPayouts =
      (
        await db.agentEarningWithdrawReq.aggregate({
          where: { agentId: agent.id },
          _sum: {
            wdAmount: true,
          },
        })
      )._sum.wdAmount || 0;
    // Calculate earnings
    const depositEarnings = depositRecords.reduce(
      (sum, record) =>
        sum + Number(record.amount) * (+site!.agentDepositEarning! / 100),
      0
    );
    const withdrawEarnings = withdrawRecords.reduce(
      (sum, record) =>
        sum + Number(record.amount) * (+site!.agentWithdrawEarning! / 100),
      0
    );

    const depositEarningsAvail = depositEarnings - +totalDepositPayouts;
    const withdrawEarningsAvail = withdrawEarnings - +totalWithdarwPayouts;

    const totalPayouts =
      (
        await db.agentEarningWithdrawReq.aggregate({
          where: {
            agentId: agent.id,
          },
          _sum: {
            amount: true,
          },
        })
      )._sum.amount || 0;

    const totalEarnings = depositEarnings + withdrawEarnings;
    const totalEarningsAvail =
      depositEarnings + withdrawEarnings - +totalPayouts;

    // Prepare chart data (group by day)
    const earningsByDate: Record<string, number> = {};

    [...depositRecords, ...withdrawRecords].forEach((record) => {
      const date = record.createdAt.toISOString().split("T")[0];
      const amount = Number(record.amount);
      const earnings = "withdrawCode" in record ? amount * 0.1 : amount * 0.05;

      if (earningsByDate[date]) {
        earningsByDate[date] += earnings;
      } else {
        earningsByDate[date] = earnings;
      }
    });

    const chartData = Object.entries(earningsByDate)
      .map(([date, earnings]) => ({
        date,
        earnings: Number(earnings.toFixed(2)),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return NextResponse.json({
      statistics: {
        totalUsers,
        accountBalance: agentWallet?.balance || 0,
        currencyCode: agentWallet?.currencyCode || "BDT",
        totalDeposits: totalDeposits._sum.amount || 0,
        totalWithdraws: totalWithdraws._sum.amount || 0,
      },
      earnings: {
        totalEarnings: Number(totalEarnings.toFixed(2)),
        totalAvailDeposit: Number(depositEarningsAvail.toFixed(2)),
        totalAvailWithdraw: Number(withdrawEarningsAvail.toFixed(2)),
        availableEarnings: Number(totalEarningsAvail.toFixed(2)), // Assuming 20% is cashed out
        depositEarnings: Number(depositEarnings.toFixed(2)),
        withdrawEarnings: Number(withdrawEarnings.toFixed(2)),
      },
      chartData,
    });
  } catch (error) {
    console.error("[AGENT_DASHBOARD_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
