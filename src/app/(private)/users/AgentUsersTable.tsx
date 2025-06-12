"use client";

import { useState } from "react";
import { useGetAgentUsersQuery } from "@/lib/features/userApiSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Ban, CircleCheck } from "lucide-react";

export default function UsersTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const limit = 10;

  const {
    data: response,
    isLoading,
    isError,
  } = useGetAgentUsersQuery({
    page,
    limit,
    search,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isError) {
    return <div>Error loading users</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Users</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Search by email or player ID"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="max-w-xs"
          />
          <Button type="submit">Search</Button>
        </form>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Deposits</TableHead>
              <TableHead>Withdraws</TableHead>
              <TableHead>Total Deposit</TableHead>
              <TableHead>Total Withdraw</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: limit }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : response?.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.playerId}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>
                      {format(new Date(user.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>{user._count.deposits}</TableCell>
                    <TableCell>{user._count.withdraws}</TableCell>
                    <TableCell>BDT {user.totalDeposit}</TableCell>
                    <TableCell>BDT {user.totalWithdraw}</TableCell>
                    <TableCell>
                      {user.isBanned ? (
                        <Ban className="text-red-500" size={18} />
                      ) : (
                        <CircleCheck className="text-green-500" size={18} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {response?.pagination && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {response.users.length} of {response.pagination.total} users
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page === 1 || isLoading}
              onClick={() => handlePageChange(page - 1)}
              size="sm"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={page >= response.pagination.totalPages || isLoading}
              onClick={() => handlePageChange(page + 1)}
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
