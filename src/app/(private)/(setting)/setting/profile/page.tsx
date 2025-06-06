/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import useCurrentUser from "@/hooks/useCurrentUser";
import DocumentModal from "./document-modal";

export default function AgentDashboard() {
  const agent: any = useCurrentUser();

  const agentData = {
    id: agent.id,
    email: agent.email,
    phone: agent.phone,
    fullName: agent.fullName,
    isVerified: agent.isVerified,
    isEmailVerified: agent.isEmailVerified,
    promo: agent.promo,
    createdAt: agent.createdAt,
    documents: agent.documents,
  };

  const walletData = {
    balance: +agent.agent.balance,
    currency: agent.agent.currencyCode,
    lastTransaction: "2023-06-10T14:45:00Z",
  };

  //   const transactions = [
  //     {
  //       id: "tx1",
  //       amount: 500.0,
  //       type: "deposit",
  //       date: "2023-06-10",
  //       status: "completed",
  //     },
  //     {
  //       id: "tx2",
  //       amount: -200.0,
  //       type: "withdrawal",
  //       date: "2023-06-05",
  //       status: "completed",
  //     },
  //     {
  //       id: "tx3",
  //       amount: 1000.0,
  //       type: "deposit",
  //       date: "2023-05-28",
  //       status: "completed",
  //     },
  //   ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar */}
        <div className="md:w-1/4 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Avatar>
                <AvatarImage src="/avatars/agent.png" />
                <AvatarFallback>{agentData.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{agentData.fullName}</CardTitle>
                <CardDescription>Agent Account</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge
                    variant={agentData.isVerified ? "default" : "secondary"}
                  >
                    {agentData.isVerified ? "Verified" : "Pending Verification"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <Badge
                    variant={
                      agentData.isEmailVerified ? "default" : "secondary"
                    }
                  >
                    {agentData.isEmailVerified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Member since:
                  </span>
                  <span className="text-sm">
                    {new Date(agentData.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/setting/profile/update">Update Profile</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/setting/password">Change Password</Link>
                </Button>
                {/* <Button variant="outline" className="w-full" asChild>
                  <Link href="/agent/documents">Upload Documents</Link>
                </Button> */}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full">
                <Link href={"/deposit"}>New Deposit</Link>
              </Button>
              <Button variant="secondary" className="w-full">
                <Link href="/withdraws">Request Withdrawal</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="md:w-3/4 space-y-6">
          {/* Wallet Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Wallet Summary</CardTitle>
              <CardDescription>
                Your current balance and recent activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Available
                  </h3>
                  <p className="text-2xl font-bold">
                    ৳{(walletData.balance * 0.95).toFixed(2)}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Total Balance
                  </h3>
                  <p className="text-2xl font-bold">
                    ৳{walletData.balance.toFixed(2)}
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Last Activity
                  </h3>
                  <p className="text-lg">
                    {new Date(walletData.lastTransaction).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          {/* <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your last 5 transactions</CardDescription>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/agent/transactions">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-medium">{tx.id}</TableCell>
                      <TableCell
                        className={
                          tx.type === "deposit"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {tx.type === "deposit" ? "+" : "-"}$
                        {Math.abs(tx.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            tx.type === "deposit" ? "default" : "outline"
                          }
                        >
                          {tx.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{tx.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card> */}

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Your personal and contact details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={agentData.fullName} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={agentData.email} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={agentData.phone} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="promo">Promo Code</Label>
                  <Input id="promo" value={agentData.promo} readOnly />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Section */}
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                Your uploaded verification documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="border rounded-lg p-4 flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Verification Document</h3>
                      <p className="text-sm text-muted-foreground">
                        {agentData.documents || "No document uploaded"}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      {!agentData.documents && (
                        <Link href="/profile/documents">Upload</Link>
                      )}
                    </Button>
                    {agentData.documents && (
                      <DocumentModal document={agentData.documents}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </DocumentModal>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
