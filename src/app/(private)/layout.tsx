
import AdminScope from "@/components/AdminScope";
import React from "react";

const PrivateRouteLayout =  ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <AdminScope>{children}</AdminScope>;
};

export default PrivateRouteLayout;
