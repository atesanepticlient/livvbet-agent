// app/api/agent/withdraws/[id]/complete/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { findAgentFromSession } from "@/data/agent";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const agent = await findAgentFromSession();
    if (!agent) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const updatedWithdraw = await db.agentWithdrawRecord.update({
      where: {
        id: id,
        agentId: agent.id,
        status: "PENDING",
      },
      data: {
        status: "ACCEPTED",
      },
      include: {
        user: {
          select: {
            playerId: true,
            email: true,
          },
        },
      },
    });

    await db.agentWallet.update({
      where: {
        agentId: agent.id,
      },
      data: {
        balance: {
          increment: updatedWithdraw.amount,
        },
      },
    });

    await db.message.create({
      data: {
        title: "Your withdraw successfull",
        user: {
          connect: {
            id: updatedWithdraw.userId,
          },
        },
      },
    });

    return NextResponse.json(updatedWithdraw);
  } catch {
    return NextResponse.json(
      { error: "Failed to complete withdrawal" },
      { status: 500 }
    );
  }
}
