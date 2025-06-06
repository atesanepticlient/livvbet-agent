/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/agent/withdraws/pending/route.ts
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
    const search = searchParams.get("search");
    const status = searchParams.get("status") || "PENDING";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const skip = (page - 1) * limit;

    const whereClause: any = {
      agentId: agent.id,
      ...(status !== "ALL" && { status }),
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

    const [withdraws, total] = await Promise.all([
      db.agentWithdrawRecord.findMany({
        where: whereClause,
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
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      db.agentWithdrawRecord.count({
        where: whereClause,
      }),
    ]);

    return NextResponse.json({
      data: withdraws,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[AGENT_PENDING_WITHDRAWS_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
