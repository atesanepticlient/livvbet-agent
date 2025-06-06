import NextAuth from "next-auth";
import { findAgentById } from "./data/agent";
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
  trustHost: true,
  callbacks: {
    async jwt({ token }) {
      const agent = await findAgentById(token.sub!);
      if (agent) {
        token.isEmailVerified = agent.isEmailVerified;
      }
      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        const agent = await findAgentById(token.sub);

        if (agent?.password) {
          agent.password = "";
        }

        if (agent) {
          session.user = { ...agent, emailVerified: new Date() };
        }
      }
      return session;
    },
  },
});
