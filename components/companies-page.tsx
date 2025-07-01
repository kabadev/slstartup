"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Filter,
  MapPin,
  Search,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { sectorsData } from "@/data/sectors";
import { companyStages, fundingStatus } from "@/data";

export default function CompaniesPage({ companies }: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [stageFilter, setStageFilter] = useState("All");
  const [fundingStatusFilter, setFundingStatusFilter] = useState("All");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    })
      .format(amount)
      .toString();
  };

  // Filter companies based on search term and filters
  const filteredCompanies = companies.filter((company: any) => {
    const matchesSearch =
      searchTerm === "" ||
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.stage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.fundingStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.amountRaised &&
        company.amountRaised.toString().includes(searchTerm)) ||
      formatCurrency(company.amountRaised)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesSector =
      sectorFilter === "All" || company.sector === sectorFilter;
    const matchesStage = stageFilter === "All" || company.stage === stageFilter;
    const matchesFundingStatus =
      fundingStatusFilter === "All" ||
      company.fundingStatus === fundingStatusFilter;

    return (
      matchesSearch && matchesSector && matchesStage && matchesFundingStatus
    );
  });

  // Sort companies
  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    const aValue = a[sortField as keyof typeof a];
    const bValue = b[sortField as keyof typeof b];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    } else {
      return 0;
    }
  });

  // Paginate companies
  const totalPages = Math.ceil(sortedCompanies.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCompanies = sortedCompanies.slice(
    startIndex,
    startIndex + pageSize
  );

  // Handle sort
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Render sort indicator
  const renderSortIndicator = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ArrowUp className="w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1" />
    );
  };

  // Export to PDF function
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text("StartUp SL - Companies Report", 14, 22);

    // Add generation date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

    // Add filters info if any are applied
    let filtersText = "";
    if (searchTerm) filtersText += `Search: "${searchTerm}" `;
    if (sectorFilter !== "All") filtersText += `Sector: ${sectorFilter} `;
    if (stageFilter !== "All") filtersText += `Stage: ${stageFilter} `;
    if (fundingStatusFilter !== "All")
      filtersText += `Funding: ${fundingStatusFilter} `;

    if (filtersText) {
      doc.text(`Filters Applied: ${filtersText}`, 14, 38);
    }

    // Prepare table data
    const tableColumns = [
      { header: "Company", dataKey: "name" },
      { header: "Sector", dataKey: "sector" },
      { header: "Location", dataKey: "location" },
      { header: "Stage", dataKey: "stage" },
      { header: "Funding Status", dataKey: "fundingStatus" },
      { header: "Amount Raised", dataKey: "amountRaised" },
    ];

    const tableRows = sortedCompanies.map((company) => ({
      name: company.name,
      sector: company.sector,
      location: company.location,
      stage: company.stage,
      fundingStatus: company.fundingStatus,
      amountRaised: formatCurrency(company.amountRaised),
    }));

    // Generate table
    autoTable(doc, {
      columns: tableColumns,
      body: tableRows,
      startY: filtersText ? 45 : 40,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [71, 85, 105], // slate-600
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252], // slate-50
      },
      margin: { top: 40 },
    });

    // Add summary
    const finalY = (doc as any).lastAutoTable.finalY || 40;
    doc.setFontSize(10);
    doc.text(`Total Companies: ${sortedCompanies.length}`, 14, finalY + 15);

    // Calculate total funding
    const totalFunding = sortedCompanies.reduce(
      (sum, company) => sum + (company.amountRaised || 0),
      0
    );
    doc.text(
      `Total Funding Raised: ${formatCurrency(totalFunding)}`,
      14,
      finalY + 25
    );

    // Save the PDF
    const fileName = `startup-sl-companies-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="px-4 py-6 ">
      <Card className="w-full border-none">
        <CardHeader className="flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
          <div>
            <CardTitle>Companies</CardTitle>
            <CardDescription>
              Manage and view all companies in StartUp SL.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {/* Filters */}
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search companies..."
                    className="w-full pl-8"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // Reset to first page on search
                    }}
                  />
                </div>
                <div className="flex flex-col w-full gap-2 sm:flex-row sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={exportToPDF}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex items-center gap-2">
                  <Select
                    value={sectorFilter}
                    onValueChange={(value) => {
                      setSectorFilter(value);
                      setCurrentPage(1); // Reset to first page on filter change
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Sectors</SelectItem>
                      {sectorsData.map((sector) => (
                        <SelectItem key={sector.title} value={sector.title}>
                          {sector.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={stageFilter}
                    onValueChange={(value) => {
                      setStageFilter(value);
                      setCurrentPage(1); // Reset to first page on filter change
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Stages</SelectItem>
                      {companyStages.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={fundingStatusFilter}
                    onValueChange={(value) => {
                      setFundingStatusFilter(value);
                      setCurrentPage(1); // Reset to first page on filter change
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Funding" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Funding</SelectItem>
                      {fundingStatus.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() => {
                    setSectorFilter("All");
                    setStageFilter("All");
                    setFundingStatusFilter("All");
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                >
                  <Filter className="w-4 h-4" />
                  Clear filters
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="w-[250px] cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Company
                        {renderSortIndicator("name")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("sector")}
                    >
                      <div className="flex items-center">
                        Sector
                        {renderSortIndicator("sector")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="hidden cursor-pointer md:table-cell"
                      onClick={() => handleSort("location")}
                    >
                      <div className="flex items-center">
                        Location
                        {renderSortIndicator("location")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("stage")}
                    >
                      <div className="flex items-center">
                        Stage
                        {renderSortIndicator("stage")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="hidden cursor-pointer lg:table-cell"
                      onClick={() => handleSort("fundingStatus")}
                    >
                      <div className="flex items-center">
                        Funding
                        {renderSortIndicator("fundingStatus")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="hidden text-right cursor-pointer lg:table-cell"
                      onClick={() => handleSort("amountRaised")}
                    >
                      <div className="flex items-center justify-end">
                        Raised
                        {renderSortIndicator("amountRaised")}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCompanies.length > 0 ? (
                    paginatedCompanies.map((company) => (
                      <TableRow key={company._id}>
                        <TableCell>
                          <Link
                            href={`/companies/${company._id}`}
                            className="flex items-center gap-3 hover:underline"
                          >
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={company.logo || "/placeholder.svg"}
                                alt={company.name}
                              />
                              <AvatarFallback>
                                {company.name.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{company.name}</span>
                          </Link>
                        </TableCell>
                        <TableCell>{company.sector}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1 text-muted-foreground" />
                            {company.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {company.stage}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge
                            variant="secondary"
                            className={`font-normal ${
                              company.fundingStatus === "Series A" ||
                              company.fundingStatus === "Series B"
                                ? "bg-green-100 text-green-800"
                                : company.fundingStatus === "Seed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {company.fundingStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden text-right lg:table-cell">
                          {formatCurrency(company?.amountRaised).toString()}
                          {/* {company.amountRaised} */}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/companies/${company._id}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No companies found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <div className="flex-1 text-sm text-muted-foreground">
                Showing{" "}
                <strong>
                  {paginatedCompanies.length > 0 ? startIndex + 1 : 0}
                </strong>{" "}
                to{" "}
                <strong>
                  {Math.min(startIndex + pageSize, filteredCompanies.length)}
                </strong>{" "}
                of <strong>{filteredCompanies.length}</strong> companies
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => {
                      setPageSize(Number(value));
                      setCurrentPage(1); // Reset to first page when changing page size
                    }}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={pageSize.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm font-medium">per page</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="w-4 h-4" />
                    <span className="sr-only">First page</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="sr-only">Previous page</span>
                  </Button>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">{currentPage}</span>
                    <span className="text-sm text-muted-foreground">of</span>
                    <span className="text-sm font-medium">
                      {totalPages || 1}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span className="sr-only">Next page</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    <ChevronsRight className="w-4 h-4" />
                    <span className="sr-only">Last page</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
