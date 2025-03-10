import { auth } from "@/auth";
import { db } from "@/lib/db";

export const findAdmin = async () => {
  return db.admin.findFirst({ where: {} });
};
export const findAdminFromSession = async () => {
  const session = await auth();

  return session?.user;
};
