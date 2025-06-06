/* eslint-disable @typescript-eslint/no-explicit-any */
// app/agent/withdraws/pending/page.tsx
"use client";

import { useState, useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  useGetPendingWithdrawsQuery,
  useCompleteWithdrawMutation,
} from "@/lib/features/withdrawApiSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import { INTERNAL_SERVER_ERROR } from "@/error";

export default function PendingWithdrawsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("PENDING");

  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
  } = useGetPendingWithdrawsQuery({
    page,
    limit,
    search: searchTerm,
    status: statusFilter,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const [completeWithdraw] = useCompleteWithdrawMutation();

  const [pending, startTransition] = useTransition();

  const handleComplete = async (id: string) => {
    const asyncAction = async () => {
      await completeWithdraw(id).unwrap();
      return true;
    };

    startTransition(() => {
      toast.promise(asyncAction(), {
        loading: "Completing...",
        success: () => "Withdraw Completed",
        error: (error) => {
          if (error.data.error) {
            return `${error.data.message}`;
          } else {
            return `${INTERNAL_SERVER_ERROR}`;
          }
        },
      });
    });

    try {
      await completeWithdraw(id).unwrap();
      toast.success("Withdrawal marked as complete");
    } catch {
      toast.error("Failed to complete withdrawal");
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("page", "1");
    if (searchTerm) params.set("search", searchTerm);
    if (statusFilter) params.set("status", statusFilter);
    if (dateRange.startDate) params.set("startDate", dateRange.startDate);
    if (dateRange.endDate) params.set("endDate", dateRange.endDate);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="container mx-auto py-8 space-y-4">
      <h1 className="text-2xl font-bold">Pending Withdrawals</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
          <Input
            placeholder="Search by Player ID or Email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="ALL">All</SelectItem>
            </SelectContent>
          </Select>

          <DatePicker
            selected={
              dateRange.startDate ? new Date(dateRange.startDate) : undefined
            }
            onSelect={(date) =>
              setDateRange({
                ...dateRange,
                startDate: date?.toISOString() || "",
              })
            }
            placeholder="Start Date"
          />

          <DatePicker
            selected={
              dateRange.endDate ? new Date(dateRange.endDate) : undefined
            }
            onSelect={(date) =>
              setDateRange({ ...dateRange, endDate: date?.toISOString() || "" })
            }
            placeholder="End Date"
          />
        </div>

        <Button onClick={handleSearch}>Search</Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Withdraw Code</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isFetching ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-destructive">
                  Failed to load withdrawals
                </TableCell>
              </TableRow>
            ) : response?.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No withdrawals found
                </TableCell>
              </TableRow>
            ) : (
              response?.data?.map((withdraw: any) => (
                <TableRow key={withdraw.id}>
                  <TableCell>{withdraw.user.playerId}</TableCell>
                  <TableCell>
                    {withdraw.user.firstName} {withdraw.user.lastName}
                  </TableCell>
                  <TableCell>
                    {typeof withdraw.amount === "number"
                      ? withdraw.amount.toFixed(2)
                      : withdraw.amount.toString()}
                  </TableCell>
                  <TableCell>{withdraw.withdrawCode}</TableCell>
                  <TableCell>
                    {new Date(withdraw.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        withdraw.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {withdraw.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {withdraw.status === "PENDING" && (
                      <Button
                        disabled={pending}
                        size="sm"
                        variant="outline"
                        onClick={() => handleComplete(withdraw.id)}
                      >
                        Complete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {response?.pagination && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Showing {response.data.length} of {response.pagination.total}{" "}
            withdrawals
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page === 1 || isLoading}
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={page >= response.pagination.totalPages || isLoading}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
