import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { db } from "./db";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generatePromoCode(length: number = 6): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let promoCode = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    promoCode += chars[randomIndex];
  }
  return promoCode;
}

export const generateRandomCode = (length: number): string => {
  const characters = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export async function getAgentByEmail(email: string) {
  return await db.agent.findUnique({ where: { email } });
}

export async function createPasswordResetToken(agentId: string) {
  const token = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

  await db.passwordResetTokenAgent.create({
    data: {
      agentId,
      token,
      expires,
    },
  });

  return token;
}

export async function verifyPasswordResetToken(agentId: string, token: string) {
  const resetToken = await db.passwordResetTokenAgent.findFirst({
    where: {
      agentId,
      token,
      expires: { gt: new Date() },
    },
  });

  return !!resetToken;
}

export async function updateAgentPassword(
  agentId: string,
  newPassword: string
) {
  // In a real app, you should hash the password before saving
  await db.agent.update({
    where: { id: agentId },
    data: { password: newPassword },
  });

  // Delete all reset tokens for this agent
  await db.passwordResetTokenAgent.deleteMany({
    where: { agentId },
  });
}
