import React, { useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useCreateEarnningReqsMutation } from "@/lib/features/earnningApiSlice";
import { toast } from "sonner";
import { INTERNAL_SERVER_ERROR } from "@/error";
const BonusClaim = ({
  children,
  data,
}: {
  children: React.ReactNode;
  data: { deEarning: number; wdEarning: number };
}) => {
  const [pending, startTr] = useTransition();
  const [createReq, { isLoading }] = useCreateEarnningReqsMutation();

  const handleCreateReq = () => {
    const asyncAction = async () => {
      const response = await createReq({
        dpAmount: data.deEarning,
        wdAmount: data.wdEarning,
      }).unwrap();
      return response.success;
    };

    startTr(() => {
      toast.promise(asyncAction(), {
        loading: "Requesting...",
        success: () => "Request was sent",
        error: (error) => {
          return `${error.data?.message || INTERNAL_SERVER_ERROR}`;
        },
      });
    });
  };

  const buttonIsLoading =
    pending || isLoading || data.deEarning + data.wdEarning <= 0;

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Claim Earning</DialogTitle>
          </DialogHeader>

          <div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span>From Withdraws:</span>
              <span>{data.wdEarning} BDT</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span>From Deposits:</span>
              <span>{data.deEarning} BDT</span>
            </div>

            <Separator className="mt-3" />

            <div className="flex mt-3 justify-between text-xs sm:text-sm">
              <span className="font-bold">Total</span>
              <span>{data.deEarning + data.wdEarning} BDT</span>
            </div>
          </div>

          <Button
            disabled={buttonIsLoading}
            className="mt-4 w-full"
            onClick={handleCreateReq}
          >
            Claim Request
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BonusClaim;
