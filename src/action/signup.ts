"use server";

import {
  AGENT_EXIST,
  INTERNAL_SERVER_ERROR,
  PROMO_USED,
  INVALID_VERIFICATION_CODE,
} from "@/error";
import { db } from "@/lib/db";
import { generatePromoCode } from "@/lib/utils";
import { signupSchema } from "@/schema";
import bcrypt from "bcryptjs";
import { generateRandomCode } from "@/lib/utils";
import nodemailer from "nodemailer";

import zod from "zod";

interface VerificationCode {
  code: string;
  expiresAt: Date;
  email: string;
}

const verificationCodes = new Map<string, VerificationCode>();

// Create a transporter for nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendVerificationEmail = async (email: string) => {
  try {
    // Check if email already exists
    const existingAgent = await db.agent.findUnique({ where: { email } });
    if (existingAgent) {
      return { error: AGENT_EXIST };
    }

    // Generate verification code
    const code = generateRandomCode(6);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiration

    // Store the verification code
    verificationCodes.set(email, { code, expiresAt, email });

    // Send email using nodemailer
    await transporter.sendMail({
      from: `"Livvbet" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: "Verify your email",
      text: `Your verification code is: ${code}`,
      html: `<p>Your verification code is: <strong>${code}</strong></p>`,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { error: INTERNAL_SERVER_ERROR };
  }
};

export const signup = async (
  data: zod.infer<typeof signupSchema>,
  verificationCode: string
) => {
  try {
    const { email, fullName, password, phone, currencyCode, promo } = data;

    // Verify the code
    const storedCode = verificationCodes.get(email);
    if (
      !storedCode ||
      storedCode.code !== verificationCode ||
      new Date() > storedCode.expiresAt
    ) {
      return { error: INVALID_VERIFICATION_CODE };
    }

    // Clear the verification code
    verificationCodes.delete(email);

    const isAgentExist = await db.agent.findUnique({ where: { email } });

    if (isAgentExist) {
      return { error: AGENT_EXIST };
    }

    const isPromoUsed = await db.agent.findFirst({ where: { promo } });

    if (isPromoUsed) {
      return { error: PROMO_USED };
    }

    const hasedPassword = await bcrypt.hash(password, 10);

    let newPromo = "";
    if (!promo) {
      newPromo = generatePromoCode(6);
    }
    await db.agent.create({
      data: {
        fullName,
        email,
        phone,
        password: hasedPassword,
        documents: "",
        promo: promo || newPromo,
        agent: {
          create: {
            balance: 0,
            currencyCode,
          },
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.log("ERROR ", error);
    return { error: INTERNAL_SERVER_ERROR };
  }
};

export const addDocuments = async (imageUrl: string, agentEmail: string) => {
  try {
    await db.agent.update({
      where: { email: agentEmail },
      data: { documents: imageUrl },
    });

    return { success: true };
  } catch {
    return { error: INTERNAL_SERVER_ERROR };
  }
};
