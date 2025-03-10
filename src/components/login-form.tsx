"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import zod from "zod";
import { loginSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
  FormField,
  FormDescription,
} from "@/components/ui/form";
import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { createVerification, verifyAdmin } from "@/action/login";
import { redirect, useSearchParams } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const redirectTo = useSearchParams().get("redirect") || "/dashboard";

  const [pending, startTransition] = useTransition();
  const [hasTokenSent, setTokenSent] = useState(false);

  const form = useForm<zod.infer<typeof loginSchema>>({
    defaultValues: {
      email: "",
      password: "",
      token: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const handleCreateVerification = (data: zod.infer<typeof loginSchema>) => {
    startTransition(() => {
      createVerification(data).then((res) => {
        if (res.success) {
          setTokenSent(true);
        } else if (res.error) {
          toast(`Oh! ${res.error}`);
        }
      });
    });
  };
  const handleVerify = (data: zod.infer<typeof loginSchema>) => {
    startTransition(() => {
      verifyAdmin(data).then((res) => {
        if (res.success) {
          toast(res.success);
          redirect(redirectTo);
        } else if (res.error) {
          toast(`Oh! ${res.error}`);
        }
      });
    });
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          {!hasTokenSent && (
            <>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent>
          {!hasTokenSent ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateVerification)}>
                <div className="flex flex-col gap-6">
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="grid gap-3">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            disabled={pending}
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="grid gap-3">
                        <div className="flex items-center">
                          <FormLabel>Password</FormLabel>
                          <Link
                            href="#"
                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                          >
                            Forgot your password?
                          </Link>
                        </div>

                        <FormControl>
                          <Input
                            disabled={pending}
                            id="password"
                            type="password"
                            placeholder="password"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col gap-3">
                    <Button type="submit" disabled={pending} className="w-full">
                      Login
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleVerify)}>
                <div className="flex flex-col gap-6">
                  <FormField
                    name="token"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="grid gap-3">
                        <FormLabel>Verify Code</FormLabel>
                        <FormControl>
                          <Input
                            disabled={pending}
                            id="token"
                            type="number"
                            placeholder="Verify Code"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          Go to your email address and find the verification
                          code
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col gap-3">
                    <Button disabled={pending} type="submit" className="w-full">
                      Verify
                    </Button>
                    <Button
                      disabled={pending}
                      variant={"secondary"}
                      onClick={() => setTokenSent(false)}
                      type="button"
                      className="w-full"
                    >
                      Go Back
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
