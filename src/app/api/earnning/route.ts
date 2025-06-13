/* eslint-disable @typescript-eslint/no-explicit-any */
import { findAgentFromSession } from "@/data/agent";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { dpAmount, wdAmount } = await req.json();

    if (!dpAmount && !wdAmount)
      return Response.json({ error: "Invalid input" }, { status: 400 });

    const site = await db.site.findFirst({
      where: {},
      select: { maxAgentPayout: true, minAgentPayout: true },
    });

    const totalAmount = dpAmount + wdAmount;

    if (totalAmount > +site!.maxAgentPayout!) {
      return Response.json({
        error: `Maximum payout ${site!.maxAgentPayout!}`,
      });
    }

    if (totalAmount < +site!.minAgentPayout!) {
      return Response.json({
        error: `Minimum payout ${site!.minAgentPayout!}`,
      });
    }

    const agent = await findAgentFromSession();

    await db.agentEarningWithdrawReq.create({
      data: {
        agent: {
          connect: {
            id: agent!.id,
          },
        },
        amount: dpAmount + wdAmount,
        dpAmount,
        wdAmount,
      },
    });

    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    console.log("Earnning request post error ", error);
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const status = searchParams.get("status") || undefined;

  const skip = (page - 1) * limit;
  const agent = await findAgentFromSession();
  try {
    const where: any = status ? { status } : { agentId: agent!.id };

    const [requests, total] = await Promise.all([
      db.agentEarningWithdrawReq.findMany({
        skip,
        take: limit,
        where,
        include: {
          agent: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.agentEarningWithdrawReq.count({ where }),
    ]);

    return Response.json({
      data: requests,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    return Response.json(
      { error: "Failed to fetch withdrawal requests" },
      { status: 500 }
    );
  }
}
