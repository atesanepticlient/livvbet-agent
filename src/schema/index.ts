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
    promo: zod.optional(zod.string()),
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

export const eWalletWithdrawInformationUpdateSchema = zod.object({
  min: zod.optional(zod.string()),
  max: zod.optional(zod.string()),
  range: zod.optional(zod.array(zod.string())),
});

export const eWalletDepositInformationUpdateSchema = zod.object({
  min: zod.optional(zod.string()),
  max: zod.optional(zod.string()),
  range: zod.optional(zod.array(zod.string())),
  walletNumber: zod.optional(zod.string()),
});

export const withdrawAddressSchema = zod.object({
  country: zod.string().min(2, "Country is required"),
  city: zod.string().min(2, "City is required"),
  postOffice: zod.string().min(2, "Post Office is required"),
  storeName: zod.string().min(2, "Store Name is required"),
});

export type WithdrawAddressSchema = zod.infer<typeof withdrawAddressSchema>;

export const profileSchema = zod.object({
  fullName: zod.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: zod.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: zod.string().min(6, {
    message: "Phone number must be at least 6 characters.",
  }),
  promo: zod.string().optional(),
});

export type ProfileSchema = zod.infer<typeof profileSchema>;

export const passwordChangeSchema = zod
  .object({
    currentPassword: zod.string().min(1, {
      message: "Current password is required",
    }),
    newPassword: zod
      .string()
      .min(8, {
        message: "Password must be at least 8 characters",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-zod]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: zod.string().min(1, {
      message: "Confirm password is required",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
