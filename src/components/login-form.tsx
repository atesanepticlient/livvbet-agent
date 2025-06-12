/* eslint-disable react/no-unescaped-entities */
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
} from "@/components/ui/form";
import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { login } from "@/action/login";
import { redirect } from "next/navigation";

function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  // const redirectTo = useSearchParams().get("redirect") || "/dashboard";

  const [pending, startTransition] = useTransition();

  const form = useForm<zod.infer<typeof loginSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = (data: zod.infer<typeof loginSchema>) => {
    startTransition(() => {
      login(data).then((res) => {
        if (res.success) {
          redirect("/dashboard");
          location.reload();
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
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)}>
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
                          placeholder="Password"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <p className="text-center text-sm ">
                  Don't have an account?{" "}
                  <Link href="/signup" className="underline hover:no-underline">
                    Create New
                  </Link>
                </p>

                <div className="flex flex-col gap-3">
                  <Button type="submit" disabled={pending} className="w-full">
                    Login
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginForm;
