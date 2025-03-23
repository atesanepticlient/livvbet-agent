import React from "react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

const UnVerifiedAgent = () => {
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
          <Button>Logout</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnVerifiedAgent;
