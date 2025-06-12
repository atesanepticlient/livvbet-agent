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
    const user = await db.users.findUnique({
      where: { id },
      include: { agent: true },
    });
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
        agentId: agent.id,
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

    await db.agentDepositRecord.create({
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

    if (!user.agent) {
      await db.users.update({
        where: { id },
        data: {
          agent: {
            connect: {
              id: agent.id,
            },
          },
        },
      });
    } else if (user.agent && user.agent.id !== agent.id) {
      await db.$transaction([
        db.users.update({
          where: { id },
          data: {
            agent: {
              disconnect: {
                id: user.agent.id,
              },
            },
          },
        }),
        db.users.update({
          where: { id },
          data: {
            agent: {
              connect: {
                id: agent.id,
              },
            },
          },
        }),
      ]);
    }
    return { success: true };
  } catch (error) {
    console.log({ error });
    return { error: INTERNAL_SERVER_ERROR };
  }
};
