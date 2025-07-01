"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useRounds } from "@/contexts/rounds-context";
import { Avatar, AvatarFallback } from "./ui/avatar";

// Helper function to get status badge color
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "draft":
      return "bg-gray-200 text-gray-800";
    case "under review":
      return "bg-yellow-100 text-yellow-800";
    case "open":
      return "bg-green-100 text-green-800";
    case "closed":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

export default function CompanyRounds() {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // const { state, actions } = useRounds();
  // const { rounds, loading, error } = state;

  // // Fetch rounds when component mounts
  // useEffect(() => {
  //   actions.fetchRounds();
  // }, [actions]);

  // // Handle errors
  // useEffect(() => {
  //   if (error) {
  //     toast({
  //       title: "Error",
  //       description: error,
  //       variant: "destructive",
  //     });
  //     actions.clearError();
  //   }
  // }, [error, actions]);
  const { state, actions } = useRounds();
  const { rounds, loading, error } = state;

  // Fetch rounds when the component mounts
  useEffect(() => {
    actions.fetchRounds(); // Ensure this is stable
  }, []); // Empty dependency array ensures it runs only once

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      actions.clearError(); // Ensure this is stable
    }
  }, [error]); // Only depend on `error`

  // Filter rounds based on search query and filters
  const filteredRounds = rounds.filter((round: any) => {
    // Search query filter
    const matchesSearch =
      searchQuery === "" ||
      round.roundTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      round._id.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === null || round.roundStatus === statusFilter;

    // Type filter
    const matchesType = typeFilter === null || round.roundType === typeFilter;

    // Date range filter
    const matchesDateRange =
      (dateRange.from === undefined ||
        new Date(round.openDate) >= dateRange.from) &&
      (dateRange.to === undefined ||
        new Date(round.closingDate) <= dateRange.to);

    return matchesSearch && matchesStatus && matchesType && matchesDateRange;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRounds.length / itemsPerPage);
  const paginatedRounds = filteredRounds.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Handle row selection
  const toggleRowSelection = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Handle select all
  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedRounds.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedRounds.map((round: any) => round._id));
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter(null);
    setTypeFilter(null);
    setDateRange({ from: undefined, to: undefined });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Funding Rounds</h1>
            <p className="text-muted-foreground">
              Manage and track all your funding rounds
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/rounds/new">
                <Plus className="h-4 w-4 mr-2" />
                New Round
              </Link>
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md font-medium flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rounds..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* <Select
                value={statusFilter || ""}
                onValueChange={(value) =>
                  setStatusFilter(value === "" ? null : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select> */}

              <Select
                value={statusFilter || "all"}
                onValueChange={(value) =>
                  setStatusFilter(value === "all" ? null : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              {/* <Select
                value={typeFilter || ""}
                onValueChange={(value) =>
                  setTypeFilter(value === "" ? null : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                  <SelectItem value="Seed">Seed</SelectItem>
                  <SelectItem value="Series A">Series A</SelectItem>
                  <SelectItem value="Series B">Series B</SelectItem>
                  <SelectItem value="Bridge / Convertible">
                    Bridge / Convertible
                  </SelectItem>
                </SelectContent>
              </Select> */}

              <Select
                value={typeFilter || "all"}
                onValueChange={(value) =>
                  setTypeFilter(value === "all" ? null : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                  <SelectItem value="Seed">Seed</SelectItem>
                  <SelectItem value="Series A">Series A</SelectItem>
                  <SelectItem value="Series B">Series B</SelectItem>
                  <SelectItem value="Bridge / Convertible">
                    Bridge / Convertible
                  </SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    {dateRange.from || dateRange.to ? (
                      <>
                        {dateRange.from
                          ? format(dateRange.from, "LLL dd, y")
                          : "Start"}
                        {" - "}
                        {dateRange.to
                          ? format(dateRange.to, "LLL dd, y")
                          : "End"}
                      </>
                    ) : (
                      "Date Range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={(range) =>
                      setDateRange(
                        range
                          ? { from: range.from, to: range.to }
                          : { from: undefined, to: undefined }
                      )
                    }
                    numberOfMonths={2}
                  />
                  <div className="flex items-center justify-between p-3 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setDateRange({ from: undefined, to: undefined })
                      }
                    >
                      Clear
                    </Button>
                    <Button size="sm">Apply</Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Active filters */}
            {(statusFilter || typeFilter || dateRange.from || dateRange.to) && (
              <div className="flex items-center gap-2 mt-4">
                <span className="text-sm text-muted-foreground">
                  Active filters:
                </span>
                {statusFilter && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Status: {statusFilter}
                    <Button
                      onClick={() => setStatusFilter(null)}
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {typeFilter && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Type: {typeFilter}
                    <Button
                      onClick={() => setTypeFilter(null)}
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {(dateRange.from || dateRange.to) && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Date:{" "}
                    {dateRange.from
                      ? format(dateRange.from, "MM/dd/yyyy")
                      : "Start"}{" "}
                    -{" "}
                    {dateRange.to ? format(dateRange.to, "MM/dd/yyyy") : "End"}
                    <Button
                      onClick={() =>
                        setDateRange({ from: undefined, to: undefined })
                      }
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-sm h-7 px-2"
                >
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={
                          paginatedRounds.length > 0 &&
                          selectedRows.length === paginatedRounds.length
                        }
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead>Round</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Investors</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        Loading rounds...
                      </TableCell>
                    </TableRow>
                  ) : paginatedRounds.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No rounds found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedRounds.map((round: any) => (
                      <TableRow key={round._id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedRows.includes(round._id)}
                            onCheckedChange={() =>
                              toggleRowSelection(round._id)
                            }
                            aria-label={`Select ${round.roundTitle}`}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{round.roundTitle}</div>

                          <Link
                            href={`/companies/${round.companyId}`}
                            className="flex items-center gap-2 mt-1"
                          >
                            <Avatar className="h-6 w-6 rounded-sm">
                              <AvatarFallback className="text-xs">
                                {getInitials(round.companyName)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-blue-500 hover:underline hover:text-primary transition-all duration-150">
                              {round.companyName}
                            </span>
                          </Link>
                        </TableCell>
                        <TableCell>{round.roundType}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(round.roundStatus)}>
                            {round.roundStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-[60px] h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${round.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {round.progress}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {format(new Date(round.openDate), "MMM d, yyyy")} -{" "}
                            {format(new Date(round.closingDate), "MMM d, yyyy")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            {/* {round.investors?.length || 0} */}

                            <div className="flex items-center justify-center mt-1 -space-x-3">
                              <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-sm font-medium text-gray-700"></div>
                              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-sm font-medium text-gray-700"></div>
                              <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-sm font-medium text-gray-700"></div>
                              <div className="w-6 h-6 rounded-full border bg-card flex items-center justify-center text-sm font-medium text-gray-700">
                                +6
                                {/* +{round.investors?.length - 3} */}
                              </div>
                              {/* {round.investors?.length > 0 && (
                                <ul className="mt-1 text-sm text-muted-foreground">
                                  {round.investors.map((investor: any) => (
                                    <li key={investor.id}>
                                      {investor.name} - {investor.amount}
                                    </li>
                                  ))}
                                </ul>
                              )} */}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/round/${round._id}`}>
                                  View details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/round/${round._id}/edit`}>
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                Invite investors
                              </DropdownMenuItem>
                              <DropdownMenuItem>Export data</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  actions
                                    .deleteRound(round._id)
                                    .then(() => {
                                      toast({
                                        title: "Round deleted",
                                        description:
                                          "The funding round has been permanently deleted.",
                                      });
                                    })
                                    .catch((error: any) => {
                                      toast({
                                        title: "Error",
                                        description:
                                          error.message ||
                                          "Failed to delete round",
                                        variant: "destructive",
                                      });
                                    });
                                }}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <strong>
                {filteredRounds.length > 0 ? (page - 1) * itemsPerPage + 1 : 0}
              </strong>{" "}
              to{" "}
              <strong>
                {Math.min(page * itemsPerPage, filteredRounds.length)}
              </strong>{" "}
              of <strong>{filteredRounds.length}</strong> rounds
            </p>
            {/* <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setPage(1); // Reset to first page when changing items per page
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={itemsPerPage.toString()} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Rows per page</SelectLabel>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select> */}

            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setPage(1); // Reset to first page when changing items per page
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={itemsPerPage.toString()} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Rows per page</SelectLabel>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <Button
                    key={pageNum}
                    variant={pageNum === page ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
