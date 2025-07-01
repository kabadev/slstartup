"use client";

import { useState } from "react";
import {
  Check,
  X,
  Eye,
  Search,
  Download,
  Mail,
  Phone,
  Calendar,
  MoreHorizontal,
  ArrowUpDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

// Mock data for investment interests
const mockInterests = [
  {
    id: "int_001",
    investor: {
      name: "Sarah Johnson",
      email: "sarah.johnson@venturecap.com",
      phone: "+1 (555) 123-4567",
      company: "Venture Capital Partners",
      type: "Venture Capital",
    },
    investment: {
      range: "$500K - $1M",
      timeframe: "3-6 months",
      experience: "experienced",
    },
    status: "accepted",
    submittedAt: "2024-01-15T10:30:00Z",
    respondedAt: "2024-01-16T14:20:00Z",
    hasTermSheet: true,
  },
  {
    id: "int_002",
    investor: {
      name: "Michael Chen",
      email: "m.chen@angelinvest.com",
      phone: "+1 (555) 234-5678",
      company: "Angel Invest Group",
      type: "Angel Investor",
    },
    investment: {
      range: "$100K - $250K",
      timeframe: "1-3 months",
      experience: "intermediate",
    },
    status: "pending",
    submittedAt: "2024-01-18T09:15:00Z",
    respondedAt: null,
    hasTermSheet: false,
  },
  {
    id: "int_003",
    investor: {
      name: "Emily Rodriguez",
      email: "emily@techfund.vc",
      phone: "+1 (555) 345-6789",
      company: "TechFund Ventures",
      type: "Venture Capital",
    },
    investment: {
      range: "$1M - $2.5M",
      timeframe: "6-12 months",
      experience: "experienced",
    },
    status: "rejected",
    submittedAt: "2024-01-12T16:45:00Z",
    respondedAt: "2024-01-14T11:30:00Z",
    hasTermSheet: false,
  },
  {
    id: "int_004",
    investor: {
      name: "David Park",
      email: "david.park@strategicvc.com",
      phone: "+1 (555) 456-7890",
      company: "Strategic Ventures",
      type: "Strategic Investor",
    },
    investment: {
      range: "$2.5M - $5M",
      timeframe: "3-6 months",
      experience: "experienced",
    },
    status: "accepted",
    submittedAt: "2024-01-10T14:20:00Z",
    respondedAt: "2024-01-11T10:15:00Z",
    hasTermSheet: true,
  },
  {
    id: "int_005",
    investor: {
      name: "Lisa Thompson",
      email: "lisa@familyoffice.com",
      phone: "+1 (555) 567-8901",
      company: "Thompson Family Office",
      type: "Family Office",
    },
    investment: {
      range: "$250K - $500K",
      timeframe: "1-3 months",
      experience: "beginner",
    },
    status: "pending",
    submittedAt: "2024-01-20T11:00:00Z",
    respondedAt: null,
    hasTermSheet: false,
  },
  {
    id: "int_006",
    investor: {
      name: "Robert Kim",
      email: "robert@impactfund.org",
      phone: "+1 (555) 678-9012",
      company: "Impact Investment Fund",
      type: "Impact Investor",
    },
    investment: {
      range: "$500K - $1M",
      timeframe: "6-12 months",
      experience: "experienced",
    },
    status: "rejected",
    submittedAt: "2024-01-08T13:30:00Z",
    respondedAt: "2024-01-09T16:45:00Z",
    hasTermSheet: false,
  },
];

const roundInfo = {
  name: "Series A",
  company: "EcoTech Innovations",
  targetAmount: "$5M",
  currentCommitted: "$2.8M",
};

export default function InvestmentInterestsTable({ interests }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("submittedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter and sort data
  const filteredInterests = interests
    .filter((interest: any) => {
      const matchesSearch =
        interest.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interest.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interest.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || interest.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a: any, b: any) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "submittedAt":
          aValue = new Date(a.submittedAt);
          bValue = new Date(b.submittedAt);
          break;
        case "investor":
          aValue = a.investor.name;
          bValue = b.investor.name;
          break;
        case "amount":
          aValue = a.investment.range;
          bValue = b.investment.range;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <Badge className="text-green-800 bg-green-100 hover:bg-green-100">
            Accepted
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getExperienceLabel = (experience: string) => {
    switch (experience) {
      case "experienced":
        return "Experienced";
      case "intermediate":
        return "Intermediate";
      case "beginner":
        return "Beginner";
      default:
        return "Unknown";
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const statusCounts = {
    all: interests.length,
    pending: interests.filter((i: any) => i.status === "pending").length,
    accepted: interests.filter((i: any) => i.status === "accepted").length,
    rejected: interests.filter((i: any) => i.status === "rejected").length,
  };

  return (
    <div className="container p-6 mx-auto space-y-6 max-w-7xl">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Investment Interests</CardTitle>
              <CardDescription>
                Manage and review all investment interests for this funding
                round
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search investors, companies, or emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("investor")}
                      className="h-auto p-0 font-semibold"
                    >
                      Investor
                      <ArrowUpDown className="w-4 h-4 ml-2" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("amount")}
                      className="h-auto p-0 font-semibold"
                    >
                      Investment
                      <ArrowUpDown className="w-4 h-4 ml-2" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("status")}
                      className="h-auto p-0 font-semibold"
                    >
                      Status
                      <ArrowUpDown className="w-4 h-4 ml-2" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("submittedAt")}
                      className="h-auto p-0 font-semibold"
                    >
                      Submitted
                      <ArrowUpDown className="w-4 h-4 ml-2" />
                    </Button>
                  </TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInterests.map((interest: any) => (
                  <TableRow key={interest.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 !rounded-md">
                          <AvatarFallback className="text-sm !rounded-md">
                            {interest.fullName
                              .split(" ")
                              .map((n: any) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{interest.fullName}</div>
                          <div className="text-sm text-muted-foreground">
                            {interest.company}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {interest.investorType}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {interest.investmentRange}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {interest.timeframe}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {getExperienceLabel(interest.investmentExperience)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getStatusBadge(interest.status)}
                        {interest.createdAt && (
                          <div className="text-xs text-muted-foreground">
                            {new Date(interest.createdAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(interest.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(interest.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      {interest.termSheet ? (
                        <Badge variant="outline" className="text-xs">
                          Term Sheet
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          None
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/investor-interest/interest/${interest._id}`}
                        >
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Link
                                href={`/investor-interest/interest/${interest._id}`}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredInterests.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                No investment interests found matching your criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
