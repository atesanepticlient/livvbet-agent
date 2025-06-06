"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import SearchUser from "./search-user";
import Recharge from "./recharge";

const Deposit = () => {
  const [seletedUser, setSeletedUser] = useState({ id: "", playerId: "" });

  return (
    <div className="w-full h-[70vh] flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle>Deposit to User</CardTitle>
        </CardHeader>
        <CardContent className="w-[300px] md:w-[350px] lg:w-[400px]">
          {!seletedUser.id && (
            <SearchUser
              onSelect={(user) =>
                setSeletedUser({ id: user.id, playerId: user.playerId })
              }
            />
          )}
          {seletedUser.id && (
            <Recharge
              user={seletedUser}
              onCancel={() => setSeletedUser({ id: "", playerId: "" })}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Deposit;
