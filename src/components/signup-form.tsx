/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { signupSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { addDocuments, sendVerificationEmail, signup } from "@/action/signup";
import Link from "next/link";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [pending, startTransition] = useTransition();
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [emailToVerify, setEmailToVerify] = useState("");
  const [documents, setDocuments] = useState<any>();

  const form = useForm<zod.infer<typeof signupSchema>>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      promo: "",
      confirmPassword: "",
      currencyCode: "",
    },
    resolver: zodResolver(signupSchema),
  });

  const handleSendVerification = () => {
    const email = form.getValues("email");
    if (!email) {
      toast("Please enter your email first");
      return;
    }

    startTransition(() => {
      sendVerificationEmail(email).then((res) => {
        if (res.success) {
          setVerificationSent(true);
          setEmailToVerify(email);
          toast("Verification code sent to your email");
        } else {
          toast(res.error);
        }
      });
    });
  };

  const handleSignup = (data: zod.infer<typeof signupSchema>) => {
    if (!verificationSent || data.email !== emailToVerify) {
      toast("Please verify your email first");
      return;
    }

    startTransition(() => {
      signup(data, verificationCode).then(async (res) => {
        if (res.success) {
          const imageUrl = await uploadImage(documents);
          await addDocuments(imageUrl, form.getValues("email"));
          redirect("/login");
        } else if (res.error) {
          toast(`Oh! ${res.error}`);
        }
      });
    });
  };

  const uploadImage = async (file: any) => {
    if (!file) return;

    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const signatureRes = await fetch("/api/sign-cloudinary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timestamp }),
      });

      const { payload } = await signatureRes.json();
      const { signature, cloud_name, api_key } = payload;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", api_key);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await uploadRes.json();

      return data.secure_url;
    } catch {
      toast.success("Unknown Error Try agin");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your details below to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignup)}>
              <div className="flex flex-col gap-6">
                <FormField
                  name="fullName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="grid ">
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={pending}
                          id="name"
                          type="text"
                          placeholder="e.g.jhon doe"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="grid ">
                      <FormLabel>Email</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            disabled={pending || verificationSent}
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          disabled={pending || verificationSent}
                          onClick={handleSendVerification}
                        >
                          {verificationSent ? "Sent" : "Verify"}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {verificationSent && (
                  <div className="grid gap-2">
                    <Label htmlFor="verificationCode">Verification Code</Label>
                    <Input
                      id="verificationCode"
                      type="text"
                      placeholder="Enter verification code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      disabled={pending}
                    />
                  </div>
                )}

                <FormField
                  name="phone"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="grid ">
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          disabled={pending}
                          id="phone"
                          type="text"
                          placeholder="01*********"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-2">
                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="grid ">
                        <FormLabel>Password</FormLabel>
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
                  <FormField
                    name="confirmPassword"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="grid ">
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            disabled={pending}
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <FormField
                    name="currencyCode"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="grid ">
                        <FormLabel>Currency</FormLabel>
                        <FormControl>
                          <Input
                            disabled={pending}
                            id="currency"
                            type="text"
                            placeholder="e.g.USD"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="promo"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="grid ">
                        <FormLabel>Promo Code (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            disabled={pending}
                            id="currency"
                            type="text"
                            placeholder="e.g.Jone12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="grid gap-3 w-full max-w-sm items-center">
                  <Label htmlFor="picture">Upload your Indentity (*NID)</Label>
                  <Input
                    id="picture"
                    type="file"
                    onChange={(e) => setDocuments(e.target!.files![0])}
                  />
                </div>
                <p className="text-center text-sm ">
                  Do you have an account?{" "}
                  <Link href="/login" className="underline hover:no-underline">
                    Login
                  </Link>
                </p>

                <div className="flex flex-col gap-3">
                  <Button type="submit" disabled={pending} className="w-full">
                    Signup
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
