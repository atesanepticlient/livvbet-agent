import { auth } from "@/auth";
import { db } from "@/lib/db";

export const findAgentById = async (id: string) => {
  return db.agent.findUnique({
    where: { id },
    include: { agent: true, withdrawAddress: true },
  });
};

export const findAgentEmail = async (email: string) => {
  return db.agent.findUnique({ where: { email } });
};

export const findAgentFromSession = async () => {
  const session = await auth();
  return session?.user;
};
