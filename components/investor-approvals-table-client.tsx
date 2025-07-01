"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { MoreHorizontal, Check, X, Loader2, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  approveInvestor,
  rejectInvestor,
} from "@/app/actions/investor-actions";

interface Investor {
  id: string;
  name: string;
  email: string;
  registrationDate: Date;
  status: "Approved" | "Pending" | "Rejected";
  type?: string;
  fundingCapacity?: string;
}

interface InvestorApprovalsTableClientProps {
  investors: Investor[];
}

export function InvestorApprovalsTableClient({
  investors: initialInvestors,
}: InvestorApprovalsTableClientProps) {
  const [investors, setInvestors] = useState(initialInvestors);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Filter investors based on search query
  const filteredInvestors = useMemo(() => {
    if (!searchQuery.trim()) {
      return investors;
    }

    const query = searchQuery.toLowerCase().trim();

    return investors.filter((investor) => {
      // Search in name
      if (investor.name.toLowerCase().includes(query)) {
        return true;
      }

      // Search in email
      if (investor.email.toLowerCase().includes(query)) {
        return true;
      }

      // Search in type
      if (investor.type?.toLowerCase().includes(query)) {
        return true;
      }

      // Search in status
      if (investor.status.toLowerCase().includes(query)) {
        return true;
      }

      // Search in registration date (formatted)
      const formattedDate = format(
        new Date(investor.registrationDate),
        "MMM dd, yyyy"
      ).toLowerCase();
      if (formattedDate.includes(query)) {
        return true;
      }

      // Search in registration date (year)
      const year = new Date(investor.registrationDate).getFullYear().toString();
      if (year.includes(query)) {
        return true;
      }

      // Search in registration date (month name)
      const monthName = format(
        new Date(investor.registrationDate),
        "MMMM"
      ).toLowerCase();
      if (monthName.includes(query)) {
        return true;
      }

      return false;
    });
  }, [investors, searchQuery]);

  const handleApprove = async (investorId: string) => {
    setLoadingStates((prev) => ({ ...prev, [investorId]: true }));

    try {
      const result = await approveInvestor(investorId);

      if (result.success) {
        setInvestors((prev) =>
          prev.map((investor) =>
            investor.id === investorId
              ? { ...investor, status: "Approved" as const }
              : investor
          )
        );
        toast({
          title: "Investor Approved",
          description: "The investor has been successfully approved.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to approve investor",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [investorId]: false }));
    }
  };

  const handleReject = async (investorId: string) => {
    setLoadingStates((prev) => ({ ...prev, [investorId]: true }));

    try {
      const result = await rejectInvestor(investorId);

      if (result.success) {
        setInvestors((prev) =>
          prev.map((investor) =>
            investor.id === investorId
              ? { ...investor, status: "Rejected" as const }
              : investor
          )
        );
        toast({
          title: "Investor Rejected",
          description: "The investor application has been rejected.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to reject investor",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [investorId]: false }));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <Badge
            variant="default"
            className="text-green-800 bg-green-100 hover:bg-green-100"
          >
            Approved
          </Badge>
        );
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
          <Input
            placeholder="Search investors by name, email, type, status, or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute p-0 -translate-y-1/2 right-1 top-1/2 h-7 w-7 hover:bg-muted"
            >
              <X className="w-3 h-3" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        {searchQuery && (
          <div className="text-sm text-muted-foreground">
            {filteredInvestors.length} of {investors.length} investors
          </div>
        )}
      </div>

      {/* Results Summary */}
      {searchQuery && filteredInvestors.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">
            No investors found matching "{searchQuery}"
          </p>
          <Button variant="link" onClick={clearSearch} className="mt-2">
            Clear search to see all investors
          </Button>
        </div>
      )}

      {/* Table */}
      {filteredInvestors.length > 0 && (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvestors.map((investor) => (
                <TableRow key={investor.id}>
                  <TableCell className="font-medium">
                    {searchQuery ? (
                      <HighlightText
                        text={investor.name}
                        highlight={searchQuery}
                      />
                    ) : (
                      investor.name
                    )}
                  </TableCell>
                  <TableCell>
                    {searchQuery ? (
                      <HighlightText
                        text={investor.email}
                        highlight={searchQuery}
                      />
                    ) : (
                      investor.email
                    )}
                  </TableCell>
                  <TableCell>
                    {investor.type ? (
                      searchQuery ? (
                        <HighlightText
                          text={investor.type}
                          highlight={searchQuery}
                        />
                      ) : (
                        investor.type
                      )
                    ) : (
                      "Not specified"
                    )}
                  </TableCell>
                  <TableCell>
                    {searchQuery ? (
                      <HighlightText
                        text={format(
                          new Date(investor.registrationDate),
                          "MMM dd, yyyy"
                        )}
                        highlight={searchQuery}
                      />
                    ) : (
                      format(
                        new Date(investor.registrationDate),
                        "MMM dd, yyyy"
                      )
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(investor.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {investor.status === "Pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove(investor.id)}
                            disabled={loadingStates[investor.id]}
                            className="text-green-600 border-green-200 hover:bg-green-50"
                          >
                            {loadingStates[investor.id] ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(investor.id)}
                            disabled={loadingStates[investor.id]}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            {loadingStates[investor.id] ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                            Reject
                          </Button>
                        </>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="w-8 h-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Send Message</DropdownMenuItem>
                          {investor.status !== "Pending" && (
                            <DropdownMenuItem>Reset Status</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* No data state */}
      {!searchQuery && investors.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">
            No investor applications found.
          </p>
        </div>
      )}
    </div>
  );
}

// Component to highlight search terms in text
function HighlightText({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  const regex = new RegExp(
    `(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-yellow-200 text-yellow-900 px-0.5 rounded"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
}
