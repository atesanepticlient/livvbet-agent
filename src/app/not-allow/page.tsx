import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CloudAlert } from "lucide-react";

const NowAllow = () => {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <Alert>
        <CloudAlert className="h-4 w-4" />

        <AlertTitle>Alert</AlertTitle>
        <AlertDescription>Please wait for admin approval</AlertDescription>
      </Alert>
    </div>
  );
};

export default NowAllow;
