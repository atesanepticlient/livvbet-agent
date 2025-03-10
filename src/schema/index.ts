import zod from "zod";

export const loginSchema = zod.object({
  email: zod.string().email("Invalid emaill address"),
  password: zod.string().min(1, "Password is required"),
  token: zod.optional(zod.string()),
});
