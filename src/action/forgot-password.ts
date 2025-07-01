// app/(auth)/agent/forgot-password/actions.ts
"use server";

import { getAgentByEmail, createPasswordResetToken } from "@/lib/utils";
import { sendMail, generatePasswordResetEmail } from "@/lib/email";
import { verifyPasswordResetToken, updateAgentPassword } from "@/lib/utils";
import bcrypt from "bcryptjs";

export async function sendPasswordResetEmail(email: string) {
  try {
    const agent = await getAgentByEmail(email);
    if (!agent) {
      return { success: false, message: "No account found with this email" };
    }

    const token = await createPasswordResetToken(agent.id);
    const emailContent = generatePasswordResetEmail(token);

    const mailResult = await sendMail({
      to: email,
      subject: "Password Reset Request",
      html: emailContent,
    });

    if (!mailResult.success) {
      return { success: false, message: "Failed to send OTP email" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in sendPasswordResetEmail:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function verifyPasswordResetOTP(email: string, otp: string) {
  try {
    const agent = await getAgentByEmail(email);
    if (!agent) {
      return { success: false, message: "Invalid request" };
    }

    const isValid = await verifyPasswordResetToken(agent.id, otp);
    if (!isValid) {
      return { success: false, message: "Invalid or expired OTP" };
    }

    return { success: true, agentId: agent.id };
  } catch (error) {
    console.error("Error in verifyPasswordResetOTP:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function resetAgentPassword(agentId: string, newPassword: string) {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateAgentPassword(agentId, hashedPassword);
    return { success: true };
  } catch (error) {
    console.error("Error in resetAgentPassword:", error);
    return { success: false, message: "Failed to update password" };
  }
}
