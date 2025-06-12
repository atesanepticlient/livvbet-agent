/* eslint-disable @typescript-eslint/no-explicit-any */
import { findAgentFromSession } from "@/data/agent";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const agent = await findAgentFromSession();
    if (!agent) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where: any = {
      agentId: agent.id,
      OR: [
        { email: { contains: search, mode: "insensitive" } },
        { playerId: { contains: search, mode: "insensitive" } },
      ],
    };

    const [users, total] = await Promise.all([
      db.users.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          email: true,
          playerId: true,
          firstName: true,
          lastName: true,
          isBanned: true,
          createdAt: true,
          _count: {
            select: {
              deposits: true,
              withdraws: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.users.count({ where }),
    ]);

    // Get deposit and withdraw totals for each user
    const usersWithTotals = await Promise.all(
      users.map(async (user) => {
        const [totalDeposit, totalWithdraw] = await Promise.all([
          db.agentDepositRecord.aggregate({
            _sum: { amount: true },
            where: { userId: user.id, agentId: agent.id },
          }),
          db.agentWithdrawRecord.aggregate({
            _sum: { amount: true },
            where: { userId: user.id, agentId: agent.id },
          }),
        ]);

        return {
          ...user,
          totalDeposit: totalDeposit._sum.amount || 0,
          totalWithdraw: totalWithdraw._sum.amount || 0,
        };
      })
    );

    return NextResponse.json({
      users: usersWithTotals,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[AGENT_USERS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
