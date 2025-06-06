// app/agent/profile/actions.ts
"use server";

import { profileSchema } from "@/schema";
import { db } from "@/lib/db";
import { z } from "zod";
import { findAgentFromSession } from "@/data/agent";

export async function updateProfile(values: z.infer<typeof profileSchema>) {
  try {
    const agent = await findAgentFromSession();
    if (!agent) {
      return { error: "You must be logged in to update your profile" };
    }

    const validatedFields = profileSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { fullName, email, phone, promo } = validatedFields.data;

    // Check if email is already taken by another agent
    const existingAgent = await db.agent.findFirst({
      where: {
        email,
        NOT: {
          id: agent.id,
        },
      },
    });

    if (existingAgent) {
      return { error: "Email already in use!" };
    }

    // Check if phone is already taken by another agent
    const existingPhone = await db.agent.findFirst({
      where: {
        phone,
        NOT: {
          id: agent.id,
        },
      },
    });

    if (existingPhone) {
      return { error: "Phone number already in use!" };
    }

    const existingPromo = await db.agent.findFirst({
      where: {
        promo,
        NOT: {
          id: agent.id,
        },
      },
    });

    if (existingPromo) {
      return { error: "Promo already in use!" };
    }

    // Update the agent
    await db.agent.update({
      where: { id: agent.id },
      data: {
        fullName,
        email,
        phone,
        promo,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { error: "Something went wrong!" };
  }
}
