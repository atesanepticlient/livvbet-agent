import { Prisma } from "@prisma/client";

interface PaymentsMethods {
  methodData: Prisma.eWalletGetPayload<{ include: { admin: true } }>[];
  methodName: string;
}

export interface PaymentDataOutput {
  payload: {
    methods: PaymentsMethods;
  };
}

export interface DepositsOutput {
  payload: Prisma.DepositGetPayload<{
    include: { user: { include: { wallet: true } } };
  }>[];
}

export interface WithdrawsOutput {
  payload: Prisma.WithdrawGetPayload<{
    include: { user: { include: { wallet: true } } };
  }>[];
}
export interface ActivityDataOutput {
  payload: Prisma.PaymentHistoryGetPayload<{
    select: {
      amount: true;
      type: true;
      user: {
        select: { email: true; wallet: { select: { currencyCode: true } } };
      };
    };
  }>[];
}

export interface StatisticsDataOutput {
  payload: {
    title: string;
    value: number;
    change: number;
    message: string;
  }[];
}

export interface UsersDataOutput {
  payload: {
    total: number;
    page: number;
    limit: number;
    users: Prisma.UsersGetPayload<{ include: { wallet: true } }>[];
  };
}

export interface UsersFetchInput {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// transaction records
// types/transaction.d.ts
export type TransactionType = "deposit" | "withdraw";

export interface TransactionRecord {
  id: string;
  amount: number ;
  createdAt: Date;
  type: TransactionType;
  user: {
    playerId: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  // Withdraw specific
  withdrawCode?: string;
}

export interface TransactionResponse {
  data: TransactionRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
