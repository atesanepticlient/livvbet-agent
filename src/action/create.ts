"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const createAdmin = async () => {
  const hasedPassword = await bcrypt.hash("1234", 10);
  await db.admin.create({
    data: {
      email: "mdhashemmia230@gmail.com",
      fullName: "San Bin Hoque",
      password: hasedPassword,
      twoFAEmail: "mdhashemmia230@gmail.com",
    },
  });

  return { success: "ok" };
};
