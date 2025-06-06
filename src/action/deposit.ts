/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { findAgentFromSession } from "@/data/agent";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";

export const depositAction = async (data: { amount: number; id: string }) => {
  try {
    const { amount, id } = data;

    const agent: any = await findAgentFromSession();

    if (!agent) return { error: "Reload the page and try again" };

    if (amount > +agent.agent.balance) {
      return { error: "Insufficient balance" };
    }
    const user = await db.users.findUnique({ where: { id } });
    if (!user) return { error: "User not found" };

    await db.wallet.update({
      where: {
        userId: id,
      },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    await db.agentWallet.update({
      where: {
        id: agent.id,
      },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    await db.message.create({
      data: {
        title: `${amount} Successfully Deposited to your account`,
        user: {
          connect: {
            id,
          },
        },
      },
    });

    const record = await db.agentDepositRecord.create({
      data: {
        amount,
        agent: {
          connect: {
            id: agent.id,
          },
        },
        user: {
          connect: {
            id: id,
          },
        },
      },
    });

    return { success: true, payload: { user, record } };
  } catch {
    return { error: INTERNAL_SERVER_ERROR };
  }
};
