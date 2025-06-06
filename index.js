import { db } from "./src/lib/db.js";

const seedWithdraw = async () => {
  await db.agentWithdrawRecord.create({
    data: {
      amount: 100,
      withdrawCode: "akdj34",
      agent: {
        connect: {
          id: "cmbjhrrbn0000ung49hqek11u",
        },
      },
      user: {
        connect: {
          id: "cmbic3dbe0000hym4apq6s67r",
        },
      },
    },
  });
  console.log("Created");
};


seedWithdraw()