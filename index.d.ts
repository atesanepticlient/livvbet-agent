import { Prisma } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: Prisma.adminGetPayload<object>;
  }

  interface Callbacks {
    session({ token, session });
  }
}
