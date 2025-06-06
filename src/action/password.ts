// app/agent/change-password/actions.ts
"use server";

import { db } from "@/lib/db";
import { passwordChangeSchema } from "@/schema";
import { compare, hash } from "bcryptjs";
import { z } from "zod";
import { findAgentFromSession } from "@/data/agent";

export async function changePassword(
  values: z.infer<typeof passwordChangeSchema>
) {
  try {
    const agentSession = await findAgentFromSession();
    if (!agentSession) {
      return { error: "Unauthorized" };
    }

    const validatedFields = passwordChangeSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { currentPassword, newPassword } = validatedFields.data;

    // Get the agent with password
    const agent = await db.agent.findUnique({
      where: { id: agentSession.id },
      select: { password: true },
    });

    if (!agent) {
      return { error: "Agent not found" };
    }

    // Verify current password
    const passwordsMatch = await compare(currentPassword, agent.password);

    if (!passwordsMatch) {
      return { error: "Current password is incorrect" };
    }

    if (currentPassword == newPassword) {
      return { error: "You used this password before" };
    }
    // Hash new password
    const hashedPassword = await hash(newPassword, 10);

    // Update password
    await db.agent.update({
      where: { id: agentSession.id },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to change password:", error);
    return { error: "Something went wrong!" };
  }
}
