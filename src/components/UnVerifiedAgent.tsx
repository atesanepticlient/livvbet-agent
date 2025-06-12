"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { logout } from "@/action/logout";
import { toast } from "sonner";

const UnVerifiedAgent = () => {
  const hanldeLogout = () => {
    logout().then((res) => {
      if (res.success) {
        location.reload();
      } else if (res.error) {
        toast.error(res.error);
      }
    });
  };
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle>Wait For approval</CardTitle>
          <CardDescription>
            Please wait for admin approval before accessing your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => hanldeLogout()}>Logout</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnVerifiedAgent;
