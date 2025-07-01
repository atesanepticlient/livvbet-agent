/* eslint-disable @typescript-eslint/no-explicit-any */
// app/actions/updateWithdrawAddress.ts
"use server";

import jwt from "jsonwebtoken";
import { db } from "@/lib/db";
import { WithdrawAddressSchema } from "@/schema";
import { findAgentFromSession } from "@/data/agent";

export async function updateWithdrawAddress(formData: WithdrawAddressSchema) {
  try {
    const agent = await findAgentFromSession();

    if (!agent) return { error: "Reload the page" };

    const token = jwt.sign(
      {
        country: formData.country.toLowerCase(),
        city: formData.city.toLowerCase(),
        postOffice: formData.postOffice.toLowerCase(),
        storeName: formData.storeName.toLowerCase(),
      },
      process.env.JWT_SECRET!,
      { noTimestamp: true }
    );

    const existingAggressOnStore = await db.agentWithdrawAddress.findFirst({
      where: {
        agentId: { not: agent.id },
        storeName: formData.storeName,
      },
    });

    if (existingAggressOnStore) {
      return { error: "Try with another store name" };
    }

    const existingAggressOnToken = await db.agentWithdrawAddress.findFirst({
      where: {
        agentId: { not: agent.id },
        token,
      },
    });

    if (existingAggressOnToken) {
      return { error: "Try with another address" };
    }

    const existing = await db.agentWithdrawAddress.findUnique({
      where: { agentId: agent.id },
    });

    if (existing) {
      await db.agentWithdrawAddress.update({
        where: { agentId: agent.id },
        data: {
          country: formData.country,
          city: formData.city,
          postOffice: formData.postOffice,
          storeName: formData.storeName,
          token,
        },
      });
    } else {
      await db.agentWithdrawAddress.create({
        data: {
          country: formData.country,
          city: formData.city,
          postOffice: formData.postOffice,
          storeName: formData.storeName,
          token,
          agent: { connect: { id: agent.id } },
        },
      });
    }

    return { success: true };
  } catch {
    return { success: false, error: "Unexpected error" };
  }
}
