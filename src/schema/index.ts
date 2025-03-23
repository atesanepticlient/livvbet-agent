import zod from "zod";

export const loginSchema = zod.object({
  email: zod.string().email("Invalid emaill address"),
  password: zod.string().min(1, "Password is required"),
});

export const signupSchema = zod
  .object({
    fullName: zod.string().min(4, "Full Name must be at least 4 characters"),
    email: zod.string().email("Invalid emaill address"),
    phone: zod.string().min(1, "Phone number is required"),
    password: zod.string().min(6, "Password must be at least 6 characters"),
    promo: zod.string().min(1, "Promo code is required"),
    confirmPassword: zod.string().min(1, "Confirm password is required"),
    currencyCode: zod.string().min(1, "Currency code is required"),
  })
  .refine(
    (data) => {
      if (data.password) {
        return data.password == data.confirmPassword;
      }
      return true;
    },
    { path: ["confirmPassword"], message: "Confirm Password did not match" }
  );
