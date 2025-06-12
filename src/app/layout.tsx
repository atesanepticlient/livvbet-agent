import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import StoreProvider from "./StoreProvider";
import { auth } from "@/auth";
import UnVerifiedAgent from "@/components/UnVerifiedAgent";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agent ",
  description: "Livvbet Agent",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        {session && session.user && !session?.user.isVerified ? (
          <UnVerifiedAgent />
        ) : (
          <Suspense>
            <SessionProvider session={session}>
              <StoreProvider>{children}</StoreProvider>
            </SessionProvider>

            <Toaster />
          </Suspense>
        )}
      </body>
    </html>
  );
}
