// components/auth/agent/ForgotPasswordForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { sendPasswordResetEmail } from "@/action/forgot-password";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await sendPasswordResetEmail(values.email);
      if (result.success) {
        // Redirect to OTP verification page
        window.location.href = `/forgot-password/verify?email=${encodeURIComponent(
          values.email
        )}`;
      } else {
        form.setError("email", {
          message: result.message || "Failed to send OTP",
        });
      }
    } catch {
      form.setError("email", {
        message: "An unexpected error occurred",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your registered email"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send OTP"}
        </Button>
      </form>
    </Form>
  );
}
