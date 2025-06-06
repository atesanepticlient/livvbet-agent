/* eslint-disable @next/next/no-img-element */
import React, { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
const DocumentModal = ({
  children,
  document,
}: {
  children: ReactNode;
  document: string;
}) => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild >{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your document</DialogTitle>
          </DialogHeader>
          <div>
            <img src={document} alt="NID" className="w-full " />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentModal;
