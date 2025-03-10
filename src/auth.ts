import NextAuth from "next-auth";
import { findAdmin } from "./data/admin";
import authConfig from "./auth.config";

export const { signIn, signOut, auth, handlers } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        const admin = await findAdmin();

        if (admin?.password) {
          admin.password = "";
        }
 
        if (admin) {
          session.user = { ...admin,emailVerified : new Date() };
        }
      }
      return session;
    },
  },
});
