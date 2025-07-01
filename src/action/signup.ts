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
    const existingAgent = await db.agent.findUnique({ where: { email } });
    if (existingAgent) {
      return { error: AGENT_EXIST };
    }

    const code = generateRandomCode(6);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    verificationCodes.set(email, { code, expiresAt, email });

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

    const storedCode = verificationCodes.get(email);
    if (
      !storedCode ||
      storedCode.code !== verificationCode ||
      new Date() > storedCode.expiresAt
    ) {
      return { error: INVALID_VERIFICATION_CODE };
    }

    verificationCodes.delete(email);

    const isAgentExist = await db.agent.findUnique({ where: { email } });
    if (isAgentExist) {
      return { error: AGENT_EXIST };
    }

    if (promo) {
      const isPromoUsed = await db.agent.findFirst({ where: { promo } });
      if (isPromoUsed) {
        return { error: PROMO_USED };
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newPromo = "";
    if (!promo) {
      newPromo = generatePromoCode(6);
    }

    await db.agent.create({
      data: {
        fullName,
        email,
        phone,
        password: hashedPassword,
        documents: "", // Will be updated after upload
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

export const addDocuments = async (documents: string, agentEmail: string) => {
  try {
    await db.agent.update({
      where: { email: agentEmail },
      data: { documents },
    });

    return { success: true };
  } catch (error) {
    console.error("Error adding documents:", error);
    return { error: INTERNAL_SERVER_ERROR };
  }
};
