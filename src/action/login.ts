"use server";
import { signIn } from "@/auth";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { loginSchema } from "@/schema";
import { CredentialsSignin } from "next-auth";
import zod from "zod";

export const login = async (data: zod.infer<typeof loginSchema>) => {
  try {
    const { email, password } = data;

    await signIn("credentials", { email, password, redirect: false });
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name !== "AccessDenied") {
        const credentialsError = error as CredentialsSignin;
        return { error: credentialsError?.cause?.err?.message };
      }
    }
    return { error: INTERNAL_SERVER_ERROR };
  }
};
