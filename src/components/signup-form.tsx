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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [pending, startTransition] = useTransition();
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [emailToVerify, setEmailToVerify] = useState("");
  const [nidFront, setNidFront] = useState<File | null>(null);
  const [nidBack, setNidBack] = useState<File | null>(null);
  const [faceVideo, setFaceVideo] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSteps, setShowSteps] = useState(false);

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

  const uploadToCloudinary = async (file: File, type: "image" | "video") => {
    if (!file) return null;

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

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      });

      return new Promise<string>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve(response.secure_url);
          } else {
            reject(new Error("Upload failed"));
          }
        };
        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${cloud_name}/${type}/upload`
        );
        xhr.send(formData);
      });
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      toast.error(`Failed to upload ${type}`);
      return null;
    }
  };

  const handleSignup = async (data: zod.infer<typeof signupSchema>) => {
    if (!verificationSent || data.email !== emailToVerify) {
      toast("Please verify your email first");
      return;
    }

    if (!nidFront || !nidBack) {
      toast("Please upload both front and back of your NID");
      return;
    }

    if (!faceVideo) {
      toast("Please upload your face verification video");
      return;
    }

    startTransition(async () => {
      try {
        setUploadProgress(0);
        toast.info("Uploading documents...");

        const [nidFrontUrl, nidBackUrl, faceVideoUrl] = await Promise.all([
          uploadToCloudinary(nidFront, "image"),
          uploadToCloudinary(nidBack, "image"),
          uploadToCloudinary(faceVideo, "video"),
        ]);

        if (!nidFrontUrl || !nidBackUrl || !faceVideoUrl) {
          toast.error("Failed to upload one or more files");
          return;
        }

        const documents = JSON.stringify({
          nidFront: nidFrontUrl,
          nidBack: nidBackUrl,
          faceVideo: faceVideoUrl,
        });

        const result = await signup(data, verificationCode);

        if (result.success) {
          await addDocuments(documents, form.getValues("email"));
          toast.success("Account created successfully!");
          redirect("/login");
        } else if (result.error) {
          toast.error(`Oh! ${result.error}`);
        }
      } catch (error) {
        console.error("Signup error:", error);
        toast.error("An error occurred during signup");
      } finally {
        setUploadProgress(0);
      }
    });
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
            <form
              onSubmit={form.handleSubmit(handleSignup)}
              className="space-y-6"
            >
              {/* Full Name - Vertical */}
              <FormField
                name="fullName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={pending}
                        type="text"
                        placeholder="e.g. John Doe"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email with Verify Button - Horizontal */}
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          disabled={pending || verificationSent}
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
                        className="whitespace-nowrap"
                      >
                        {verificationSent ? "Sent" : "Verify"}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Verification Code - Vertical */}
              {verificationSent && (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter verification code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    disabled={pending}
                  />
                </FormItem>
              )}

              {/* Phone - Vertical */}
              <FormField
                name="phone"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        disabled={pending}
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

              {/* Password & Confirm Password - Horizontal */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          disabled={pending}
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
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          disabled={pending}
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

              {/* Currency & Promo Code - Horizontal */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="currencyCode"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <Input
                          disabled={pending}
                          type="text"
                          placeholder="e.g. USD"
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
                    <FormItem>
                      <FormLabel>Promo Code (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          disabled={pending}
                          type="text"
                          placeholder="e.g. Jone12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Verification Section - Vertical */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Identity Verification</Label>
                  <Dialog open={showSteps} onOpenChange={setShowSteps}>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        className="h-auto bg-indigo-600 px-2 py-1 hover:bg-indigo-700 text-white text-sm"
                      >
                        Rules
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Verification Process</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">
                            NID Upload Instructions:
                          </h4>
                          <ol className="list-decimal pl-5 space-y-1">
                            <li>Ensure your NID is valid and not expired</li>
                            <li>Take clear photos of both front and back</li>
                            <li>Make sure all details are visible</li>
                            <li>No glare or reflections on the NID</li>
                          </ol>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">
                            Face Verification Video:
                          </h4>
                          <ol className="list-decimal pl-5 space-y-1">
                            <li>Record in a well-lit area</li>
                            <li>Hold your NID next to your face</li>
                            <li>Slowly rotate your head left and right</li>
                            <li>Ensure both your face and NID are visible</li>
                            <li>Video must be at least 10 seconds</li>
                          </ol>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* NID Uploads - Vertical */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nidFront">NID Front Side *</Label>
                    <Input
                      id="nidFront"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNidFront(e.target.files?.[0] || null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nidBack">NID Back Side *</Label>
                    <Input
                      id="nidBack"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNidBack(e.target.files?.[0] || null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faceVideo">
                      Face Verification Video (10s) *
                    </Label>
                    <Input
                      id="faceVideo"
                      type="file"
                      accept="video/*"
                      onChange={(e) =>
                        setFaceVideo(e.target.files?.[0] || null)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Upload Progress - Vertical */}
              {uploadProgress > 0 && (
                <div className="space-y-2">
                  <Label>Upload Progress</Label>
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground text-right">
                    {uploadProgress}%
                  </p>
                </div>
              )}

              {/* Login Link - Vertical */}
              <div className="text-center text-sm">
                Do you have an account?{" "}
                <Link href="/login" className="underline hover:no-underline">
                  Login
                </Link>
              </div>

              {/* Submit Button - Vertical */}
              <Button type="submit" disabled={pending} className="w-full">
                {pending ? "Processing..." : "Signup"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
