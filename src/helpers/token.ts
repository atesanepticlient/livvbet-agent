import { db } from "@/lib/db";

export const createAdminVerificationToken = async (token : string) => {
  try {
    const existingToken = await db.adminEmailVerificationToken.findFirst({
      where: {},
    });
    const expires: Date = new Date(Date.now() + 3600 * 1000);
    if (existingToken) {
      return (await db.adminEmailVerificationToken.update({
        where: { id: existingToken.id },
        data: {
          token,
          expire: expires,
        },
      }));
    }

    return (await db.adminEmailVerificationToken.create({
      data: { token, expire: expires },
    }));
  } catch {
    return null;
  }
};
