/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/agent/transactions/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { findAgentFromSession } from "@/data/agent";

export async function GET(request: Request) {
  try {
    const agent = await findAgentFromSession();
    if (!agent) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type"); // 'deposit' or 'withdraw'
    const search = searchParams.get("search"); // playerId or email
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const skip = (page - 1) * limit;

    console.log({ type });

    // Build where clauses
    const whereClause: any = {
      agentId: agent.id,
      
      ...(search && {
        OR: [
          { user: { playerId: { contains: search, mode: "insensitive" } } },
          { user: { email: { contains: search, mode: "insensitive" } } },
        ],
      }),
      ...(startDate &&
        endDate && {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
    };

    // Fetch both deposit and withdraw records in parallel
    const [deposits, withdraws, totalDeposits, totalWithdraws] =
      await Promise.all([
        db.agentDepositRecord.findMany({
          where: type === "withdraw" ? { id: "" } : whereClause, // Empty if only withdraws needed
          include: {
            user: {
              select: {
                playerId: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        db.agentWithdrawRecord.findMany({
          where:
            type === "deposit"
              ? { id: "", status: "ACCEPTED" }
              : { ...whereClause, status: "ACCEPTED" }, // Empty if only deposits needed
          include: {
            user: {
              select: {
                playerId: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        db.agentDepositRecord.count({
          where: type === "withdraw" ? { id: "" } : whereClause,
        }),
        db.agentWithdrawRecord.count({
          where: type === "deposit" ? { id: "" } : whereClause,
        }),
      ]);

    // Combine and sort records by date
    const combinedRecords = [
      ...deposits.map((d) => ({ ...d, type: "deposit" as const })),
      ...withdraws.map((w) => ({ ...w, type: "withdraw" as const })),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const totalRecords =
      type === "deposit"
        ? totalDeposits
        : type === "withdraw"
        ? totalWithdraws
        : totalDeposits + totalWithdraws;

    return NextResponse.json({
      data: combinedRecords.slice(0, limit), // Ensure we don't exceed limit
      pagination: {
        total: totalRecords,
        page,
        limit,
        totalPages: Math.ceil(totalRecords / limit),
      },
    });
  } catch (error) {
    console.error("[AGENT_TRANSACTIONS_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
