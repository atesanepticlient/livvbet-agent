/* eslint-disable @typescript-eslint/no-explicit-any */
import { depositAction } from "@/action/deposit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useCurrentUser from "@/hooks/useCurrentUser";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import { FaUser } from "react-icons/fa";

const Recharge = ({
  user,
  onCancel,
}: {
  user: { id: string; playerId: string };
  onCancel: () => void;
}) => {
  const agent: any = useCurrentUser();

  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const [pending, startTr] = useTransition();

  const handleSubmit = () => {
    if (!amount) {
      return setError("Enter the amount");
    }
    if (error) {
      setError("");
    }
    const asyncAction = async () => {
      const response = await depositAction({ amount: +amount, id: user.id });
      if (response.error) {
        throw new Error(response.error);
      }
      return response.success;
    };

    startTr(() => {
      toast.promise(asyncAction(), {
        loading: "Sending...",
        success: () => "Balance added to the user",
        error: (error) => {
          return `${error.message}`;
        },
      });
    });
  };

  return (
    <div className="w-full">
      <div className="flex-col items-center justify-between gap-1">
        <Input
          disabled={pending}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="block"
          min={0}
        />
        <div className="flex justify-between py-1">
          <span className="text-sm  lg:text-sm font-bold text-white/80">
            Your Balance : ৳{+agent.agent.balance}
          </span>

          <span className="text-sm flex items-center lg:text-sm font-bold text-white/80">
            <FaUser className="w-3 h-3 text-white" />
            {user.playerId}
          </span>
        </div>
      </div>
      {error && (
        <span className="block my-2 text-xs lg:text-sm font-medium text-red-700">
          {error}
        </span>
      )}
      <div className="flex items-center justify-between gap-2 mt-3 md:mt-5 lg:mt-6">
        <Button
          variant={"outline"}
          disabled={pending}
          onClick={() => {
            onCancel();
          }}
        >
          Cancle
        </Button>
        <Button
          disabled={pending}
          onClick={() => {
            handleSubmit();
          }}
        >
          Deposit
        </Button>
      </div>
    </div>
  );
};

export default Recharge;
