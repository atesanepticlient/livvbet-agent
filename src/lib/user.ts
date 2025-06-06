import { auth } from "@/auth";

export const getAgent = async () => {
  const session = await auth();
  return session?.user;
};
