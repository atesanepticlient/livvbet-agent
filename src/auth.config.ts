import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { CREDENTICALS_INCORRECT } from "./error";

export const config = {
  runtime: "nodejs",
};

export default {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { name: "email", type: "email" },
        password: { name: "password", type: "password" },
      },

      async authorize(credentials) {
        const user: string = (credentials!.email as string) || "";
        const password: string = (credentials!.password as string) || "";

        if (!user || !password) {
          throw new Error(CREDENTICALS_INCORRECT);
        }

        const account = await db.agent.findUnique({
          where: { email: user },
        });

        if (!account) {
          throw new Error(CREDENTICALS_INCORRECT);
        }

        const passwordIsMatch = await bcrypt.compare(
          password,
          account.password
        );

        if (!passwordIsMatch) {
          throw new Error(CREDENTICALS_INCORRECT);
        }
        return account;
      },
    }),
  ],
} satisfies NextAuthConfig;
