"use server";

import { AGENT_EXIST, INTERNAL_SERVER_ERROR, PROMO_USED } from "@/error";
import { db } from "@/lib/db";
import { generatePromoCode } from "@/lib/utils";
import { signupSchema } from "@/schema";
import bcrypt from "bcryptjs";

import zod from "zod";

export const signup = async (data: zod.infer<typeof signupSchema>) => {
  try {
    const { email, fullName, password, phone, currencyCode, promo } = data;

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
