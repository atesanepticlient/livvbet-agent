/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useGetTransactionsQuery } from "@/lib/features/tranasctionApiSlice";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, Search } from "lucide-react";
import { format } from "date-fns";

export default function AgentTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"deposit" | "withdraw" | "">("");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
  } = useGetTransactionsQuery({
    page,
    limit,
    type: typeFilter as "deposit" | "withdraw",
    search: searchTerm,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("page", "1");
    if (searchTerm) params.set("search", searchTerm);
    if (typeFilter) params.set("type", typeFilter);
    if (dateRange.startDate) params.set("startDate", dateRange.startDate);
    if (dateRange.endDate) params.set("endDate", dateRange.endDate);
    router.push(`${pathname}?${params.toString()}`);
    setIsFilterOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-2 py-4 space-y-4 sm:px-4 sm:py-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold sm:text-2xl">Transaction History</h1>

        {/* Mobile filter button */}
        <div className="sm:hidden">
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Filters</h4>
                  <p className="text-sm text-muted-foreground">
                    Apply filters to narrow down results
                  </p>
                </div>
                <div className="grid gap-4">
                  <Input
                    placeholder="Search by Player ID or Email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Select
                    value={typeFilter}
                    onValueChange={(value) =>
                      setTypeFilter(value as "deposit" | "withdraw" | "")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Transactions</SelectItem>
                      <SelectItem value="deposit">Deposits</SelectItem>
                      <SelectItem value="withdraw">Withdrawals</SelectItem>
                    </SelectContent>
                  </Select>
                  <DatePicker
                    selected={
                      dateRange.startDate
                        ? new Date(dateRange.startDate)
                        : undefined
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
                      dateRange.endDate
                        ? new Date(dateRange.endDate)
                        : undefined
                    }
                    onSelect={(date) =>
                      setDateRange({
                        ...dateRange,
                        endDate: date?.toISOString() || "",
                      })
                    }
                    placeholder="End Date"
                  />
                  <Button onClick={handleSearch} className="w-full">
                    <Search className="h-4 w-4 mr-2" />
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Desktop filters */}
      <div className="hidden sm:flex flex-col md:flex-row gap-4 items-end">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
          <Input
            placeholder="Search by Player ID or Email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Select
            value={typeFilter}
            onValueChange={(value) =>
              setTypeFilter(value as "deposit" | "withdraw" | "")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="deposit">Deposits</SelectItem>
              <SelectItem value="withdraw">Withdrawals</SelectItem>
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
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[600px] sm:min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead>Player ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isFetching ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-destructive py-8"
                >
                  Failed to load transactions
                </TableCell>
              </TableRow>
            ) : response?.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              response?.data?.map((transaction: any) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        transaction.type === "deposit"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {transaction.type.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.user.playerId}
                  </TableCell>
                  <TableCell>
                    {transaction.user.firstName} {transaction.user.lastName}
                  </TableCell>
                  <TableCell>BDT {transaction.amount}</TableCell>
                  
                  <TableCell className="whitespace-nowrap">
                    {format(
                      new Date(transaction.createdAt),
                      "MMM dd, yyyy HH:mm"
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
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {response.data.length} of {response.pagination.total}{" "}
            transactions
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
