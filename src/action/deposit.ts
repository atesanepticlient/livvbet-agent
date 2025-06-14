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

    const site = await db.site.findFirst({
      where: {},
      select: { minAgDeposit: true, maxAgDeposit: true },
    });

    if (amount > +site!.maxAgDeposit!) {
      return { error: `Maximum deposit ${+site!.maxAgDeposit!}` };
    }

    if (amount < +site!.minAgDeposit!) {
      return { error: `Minimum deposit ${+site!.minAgDeposit!}` };
    }

    if (amount > +agent.agent.balance) {
      return { error: "Insufficient balance" };
    }
    const user = await db.users.findUnique({
      where: { id },
      include: { agent: true, deposits: true },
    });

    if (!user) return { error: "User not found" };

    if (!user.deposits || user.deposits.length == 0) {
      const site = await db.site.findFirst({
        where: {},
        select: { firstDepositBonus: true, turnover: true },
      });

      await db.bonusWallet.update({
        where: {
          userId: user!.id,
        },
        data: {
          balance: { increment: amount * (+site!.firstDepositBonus! / 100) },
          turnOver: {
            increment:
              amount * (+site!.firstDepositBonus! / 100) * +site!.turnover!,
          },
        },
      });
    }

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
