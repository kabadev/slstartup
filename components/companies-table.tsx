// "use client";

// import { useState } from "react";
// import {
//   ArrowDown,
//   ArrowUp,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
//   Download,
//   Search,
//   SlidersHorizontal,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// // Sample company data
// const companies = [
//   {
//     id: 1,
//     name: "Acme Corporation",
//     industry: "Technology",
//     location: "New York, USA",
//     employees: 1250,
//     founded: 2005,
//     status: "Active",
//     revenue: "$25M",
//   },
//   {
//     id: 2,
//     name: "Globex Industries",
//     industry: "Manufacturing",
//     location: "Chicago, USA",
//     employees: 3200,
//     founded: 1998,
//     status: "Active",
//     revenue: "$120M",
//   },
//   {
//     id: 3,
//     name: "Stark Enterprises",
//     industry: "Technology",
//     location: "San Francisco, USA",
//     employees: 850,
//     founded: 2010,
//     status: "Active",
//     revenue: "$42M",
//   },
//   {
//     id: 4,
//     name: "Wayne Industries",
//     industry: "Manufacturing",
//     location: "Gotham, USA",
//     employees: 4500,
//     founded: 1975,
//     status: "Active",
//     revenue: "$350M",
//   },
//   {
//     id: 5,
//     name: "Umbrella Corporation",
//     industry: "Pharmaceuticals",
//     location: "Boston, USA",
//     employees: 2100,
//     founded: 1992,
//     status: "Inactive",
//     revenue: "$80M",
//   },
//   {
//     id: 6,
//     name: "Cyberdyne Systems",
//     industry: "Technology",
//     location: "Los Angeles, USA",
//     employees: 750,
//     founded: 2008,
//     status: "Active",
//     revenue: "$18M",
//   },
//   {
//     id: 7,
//     name: "Oscorp Industries",
//     industry: "Biotechnology",
//     location: "New York, USA",
//     employees: 1800,
//     founded: 1995,
//     status: "Active",
//     revenue: "$65M",
//   },
//   {
//     id: 8,
//     name: "Massive Dynamic",
//     industry: "Research",
//     location: "Boston, USA",
//     employees: 920,
//     founded: 2003,
//     status: "Active",
//     revenue: "$38M",
//   },
//   {
//     id: 9,
//     name: "Soylent Corp",
//     industry: "Food Processing",
//     location: "Seattle, USA",
//     employees: 1450,
//     founded: 1990,
//     status: "Active",
//     revenue: "$55M",
//   },
//   {
//     id: 10,
//     name: "Initech",
//     industry: "Technology",
//     location: "Austin, USA",
//     employees: 320,
//     founded: 2001,
//     status: "Inactive",
//     revenue: "$12M",
//   },
//   {
//     id: 11,
//     name: "Weyland-Yutani",
//     industry: "Aerospace",
//     location: "Houston, USA",
//     employees: 5200,
//     founded: 1979,
//     status: "Active",
//     revenue: "$280M",
//   },
//   {
//     id: 12,
//     name: "Tyrell Corporation",
//     industry: "Biotechnology",
//     location: "San Diego, USA",
//     employees: 1100,
//     founded: 1999,
//     status: "Active",
//     revenue: "$48M",
//   },
// ];

// // Available industries for filtering
// const industries = [...new Set(companies.map((company) => company.industry))];

// export default function CompaniesTable() {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(5);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [industryFilter, setIndustryFilter] = useState("All");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [sortField, setSortField] = useState("name");
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

//   // Filter companies based on search term and filters
//   const filteredCompanies = companies.filter((company) => {
//     const matchesSearch =
//       company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       company.location.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesIndustry =
//       industryFilter === "All" || company.industry === industryFilter;
//     const matchesStatus =
//       statusFilter === "All" || company.status === statusFilter;

//     return matchesSearch && matchesIndustry && matchesStatus;
//   });

//   // Sort companies
//   const sortedCompanies = [...filteredCompanies].sort((a, b) => {
//     const aValue = a[sortField as keyof typeof a];
//     const bValue = b[sortField as keyof typeof b];

//     if (typeof aValue === "string" && typeof bValue === "string") {
//       return sortDirection === "asc"
//         ? aValue.localeCompare(bValue)
//         : bValue.localeCompare(aValue);
//     } else {
//       return sortDirection === "asc"
//         ? aValue < bValue
//           ? -1
//           : 1
//         : bValue < aValue
//         ? -1
//         : 1;
//     }
//   });

//   // Paginate companies
//   const totalPages = Math.ceil(sortedCompanies.length / pageSize);
//   const startIndex = (currentPage - 1) * pageSize;
//   const paginatedCompanies = sortedCompanies.slice(
//     startIndex,
//     startIndex + pageSize
//   );

//   // Handle sort
//   const handleSort = (field: string) => {
//     if (field === sortField) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc");
//     } else {
//       setSortField(field);
//       setSortDirection("asc");
//     }
//   };

//   // Render sort indicator
//   const renderSortIndicator = (field: string) => {
//     if (sortField !== field) return null;
//     return sortDirection === "asc" ? (
//       <ArrowUp className="ml-1 h-4 w-4" />
//     ) : (
//       <ArrowDown className="ml-1 h-4 w-4" />
//     );
//   };

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle>Companies</CardTitle>
//         <CardDescription>
//           Manage and view all companies in your organization.
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="flex flex-col space-y-4">
//           {/* Filters */}
//           <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
//             <div className="relative w-full sm:w-64">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 type="search"
//                 placeholder="Search companies..."
//                 className="pl-8 w-full"
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   setCurrentPage(1); // Reset to first page on search
//                 }}
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
//               <div className="flex items-center gap-2">
//                 <Select
//                   value={industryFilter}
//                   onValueChange={(value) => {
//                     setIndustryFilter(value);
//                     setCurrentPage(1); // Reset to first page on filter change
//                   }}
//                 >
//                   <SelectTrigger className="w-full sm:w-[180px]">
//                     <SelectValue placeholder="Industry" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="All">All Industries</SelectItem>
//                     {industries.map((industry) => (
//                       <SelectItem key={industry} value={industry}>
//                         {industry}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Select
//                   value={statusFilter}
//                   onValueChange={(value) => {
//                     setStatusFilter(value);
//                     setCurrentPage(1); // Reset to first page on filter change
//                   }}
//                 >
//                   <SelectTrigger className="w-full sm:w-[180px]">
//                     <SelectValue placeholder="Status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="All">All Statuses</SelectItem>
//                     <SelectItem value="Active">Active</SelectItem>
//                     <SelectItem value="Inactive">Inactive</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <Button variant="outline" className="ml-auto">
//                 <Download className="mr-2 h-4 w-4" />
//                 Export
//               </Button>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead
//                     className="w-[250px] cursor-pointer"
//                     onClick={() => handleSort("name")}
//                   >
//                     <div className="flex items-center">
//                       Company Name
//                       {renderSortIndicator("name")}
//                     </div>
//                   </TableHead>
//                   <TableHead
//                     className="cursor-pointer"
//                     onClick={() => handleSort("industry")}
//                   >
//                     <div className="flex items-center">
//                       Industry
//                       {renderSortIndicator("industry")}
//                     </div>
//                   </TableHead>
//                   <TableHead
//                     className="hidden md:table-cell cursor-pointer"
//                     onClick={() => handleSort("location")}
//                   >
//                     <div className="flex items-center">
//                       Location
//                       {renderSortIndicator("location")}
//                     </div>
//                   </TableHead>
//                   <TableHead
//                     className="hidden md:table-cell cursor-pointer text-right"
//                     onClick={() => handleSort("employees")}
//                   >
//                     <div className="flex items-center justify-end">
//                       Employees
//                       {renderSortIndicator("employees")}
//                     </div>
//                   </TableHead>
//                   <TableHead
//                     className="hidden lg:table-cell cursor-pointer text-right"
//                     onClick={() => handleSort("founded")}
//                   >
//                     <div className="flex items-center justify-end">
//                       Founded
//                       {renderSortIndicator("founded")}
//                     </div>
//                   </TableHead>
//                   <TableHead
//                     className="cursor-pointer text-center"
//                     onClick={() => handleSort("status")}
//                   >
//                     <div className="flex items-center justify-center">
//                       Status
//                       {renderSortIndicator("status")}
//                     </div>
//                   </TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {paginatedCompanies.length > 0 ? (
//                   paginatedCompanies.map((company) => (
//                     <TableRow key={company.id}>
//                       <TableCell className="font-medium">
//                         {company.name}
//                       </TableCell>
//                       <TableCell>{company.industry}</TableCell>
//                       <TableCell className="hidden md:table-cell">
//                         {company.location}
//                       </TableCell>
//                       <TableCell className="hidden md:table-cell text-right">
//                         {company.employees.toLocaleString()}
//                       </TableCell>
//                       <TableCell className="hidden lg:table-cell text-right">
//                         {company.founded}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         <Badge
//                           variant={
//                             company.status === "Active"
//                               ? "default"
//                               : "secondary"
//                           }
//                         >
//                           {company.status}
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" size="sm">
//                               <SlidersHorizontal className="h-4 w-4" />
//                               <span className="sr-only">Open menu</span>
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end">
//                             <DropdownMenuItem>View details</DropdownMenuItem>
//                             <DropdownMenuItem>Edit company</DropdownMenuItem>
//                             <DropdownMenuItem>View history</DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={7} className="h-24 text-center">
//                       No companies found.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>

//           {/* Pagination */}
//           <div className="flex items-center justify-between">
//             <div className="flex-1 text-sm text-muted-foreground">
//               Showing{" "}
//               <strong>
//                 {paginatedCompanies.length > 0 ? startIndex + 1 : 0}
//               </strong>{" "}
//               to{" "}
//               <strong>
//                 {Math.min(startIndex + pageSize, filteredCompanies.length)}
//               </strong>{" "}
//               of <strong>{filteredCompanies.length}</strong> companies
//             </div>
//             <div className="flex items-center space-x-2">
//               <div className="flex items-center space-x-2">
//                 <Select
//                   value={pageSize.toString()}
//                   onValueChange={(value) => {
//                     setPageSize(Number(value));
//                     setCurrentPage(1); // Reset to first page when changing page size
//                   }}
//                 >
//                   <SelectTrigger className="h-8 w-[70px]">
//                     <SelectValue placeholder={pageSize.toString()} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="5">5</SelectItem>
//                     <SelectItem value="10">10</SelectItem>
//                     <SelectItem value="20">20</SelectItem>
//                     <SelectItem value="50">50</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <p className="text-sm font-medium">per page</p>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   onClick={() => setCurrentPage(1)}
//                   disabled={currentPage === 1}
//                 >
//                   <ChevronsLeft className="h-4 w-4" />
//                   <span className="sr-only">First page</span>
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   onClick={() => setCurrentPage(currentPage - 1)}
//                   disabled={currentPage === 1}
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                   <span className="sr-only">Previous page</span>
//                 </Button>
//                 <div className="flex items-center gap-1">
//                   <span className="text-sm font-medium">{currentPage}</span>
//                   <span className="text-sm text-muted-foreground">of</span>
//                   <span className="text-sm font-medium">{totalPages || 1}</span>
//                 </div>
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   onClick={() => setCurrentPage(currentPage + 1)}
//                   disabled={currentPage === totalPages || totalPages === 0}
//                 >
//                   <ChevronRight className="h-4 w-4" />
//                   <span className="sr-only">Next page</span>
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   onClick={() => setCurrentPage(totalPages)}
//                   disabled={currentPage === totalPages || totalPages === 0}
//                 >
//                   <ChevronsRight className="h-4 w-4" />
//                   <span className="sr-only">Last page</span>
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Search,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { getCompaniesAction } from "@/app/actions/company-actions";

// Define Company interface based on your MongoDB schema
interface Company {
  _id: string;
  name: string;
  sector: string;
  location?: string;
  foundedAt?: string;
  stage?: string;
  employeesRange?: string;
  isYouthLed?: boolean;
  isWomanLed?: boolean;
}

export default function CompaniesTable() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [stageFilter, setStageFilter] = useState("All");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Fetch companies data
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const result = await getCompaniesAction();
        if (result.success) {
          setCompanies(result.companies || []);
        } else {
          setError(result.error || "Failed to fetch companies");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Set isClient to true after component mounts to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Extract unique sectors for filtering
  const sectors =
    isClient && companies.length > 0
      ? [...new Set(companies.map((company) => company.sector).filter(Boolean))]
      : [];

  // Extract unique stages for filtering
  const stages =
    isClient && companies.length > 0
      ? [...new Set(companies.map((company) => company.stage).filter(Boolean))]
      : [];

  // Filter companies based on search term and filters
  const filteredCompanies = isClient
    ? companies.filter((company) => {
        const matchesSearch =
          company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          false ||
          company.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          false;

        const matchesSector =
          sectorFilter === "All" || company.sector === sectorFilter;
        const matchesStage =
          stageFilter === "All" || company.stage === stageFilter;

        return matchesSearch && matchesSector && matchesStage;
      })
    : [];

  // Sort companies
  const sortedCompanies = isClient
    ? [...filteredCompanies].sort((a, b) => {
        const aValue = a[sortField as keyof Company] || "";
        const bValue = b[sortField as keyof Company] || "";

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else if (typeof aValue === "boolean" && typeof bValue === "boolean") {
          return sortDirection === "asc"
            ? aValue === bValue
              ? 0
              : aValue
              ? -1
              : 1
            : aValue === bValue
            ? 0
            : aValue
            ? 1
            : -1;
        } else {
          return sortDirection === "asc"
            ? aValue < bValue
              ? -1
              : 1
            : bValue < aValue
            ? -1
            : 1;
        }
      })
    : [];

  // Paginate companies
  const totalPages = isClient
    ? Math.ceil(sortedCompanies.length / pageSize)
    : 0;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCompanies = isClient
    ? sortedCompanies.slice(startIndex, startIndex + pageSize)
    : [];

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
      <ArrowUp className="ml-1 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4" />
    );
  };

  // Export to CSV
  const exportToCSV = () => {
    if (!isClient || companies.length === 0) return;

    const headers = [
      "Name",
      "Sector",
      "Location",
      "Founded",
      "Stage",
      "Employees",
      "Youth Led",
      "Woman Led",
    ];
    const csvData = filteredCompanies.map((company) => [
      company.name || "",
      company.sector || "",
      company.location || "",
      company.foundedAt ? new Date(company.foundedAt).getFullYear() : "",
      company.stage || "",
      company.employeesRange || "",
      company.isYouthLed ? "Yes" : "No",
      company.isWomanLed ? "Yes" : "No",
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "companies.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Navigate to company details
  const viewCompanyDetails = (id: string) => {
    router.push(`/companies/${id}`);
  };

  // Render loading skeletons
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Companies</CardTitle>
          <CardDescription>
            Manage and view all companies in your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <Skeleton className="h-10 w-full sm:w-64" />
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Skeleton className="h-10 w-full sm:w-[180px]" />
                <Skeleton className="h-10 w-full sm:w-[180px]" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Company Name</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Location
                    </TableHead>
                    <TableHead className="hidden md:table-cell text-right">
                      Employees
                    </TableHead>
                    <TableHead className="hidden lg:table-cell text-right">
                      Founded
                    </TableHead>
                    <TableHead className="text-center">Stage</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-right">
                          <Skeleton className="h-5 w-20 ml-auto" />
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-right">
                          <Skeleton className="h-5 w-16 ml-auto" />
                        </TableCell>
                        <TableCell className="text-center">
                          <Skeleton className="h-5 w-16 mx-auto" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-8 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-64" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-[200px]" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render error state
  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Companies</CardTitle>
          <CardDescription>
            There was an error loading the companies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Only render the actual content when we're on the client side
  if (!isClient) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Companies</CardTitle>
          <CardDescription>
            Manage and view all companies in your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Companies</CardTitle>
        <CardDescription>
          Manage and view all companies in your organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search companies..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
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
                    {sectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
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
                    {stages.map((stage) => (
                      <SelectItem key={stage} value={stage!}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                className="ml-auto"
                onClick={exportToCSV}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="w-[250px] cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Company Name
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
                    className="hidden md:table-cell cursor-pointer"
                    onClick={() => handleSort("location")}
                  >
                    <div className="flex items-center">
                      Location
                      {renderSortIndicator("location")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="hidden md:table-cell cursor-pointer text-right"
                    onClick={() => handleSort("employeesRange")}
                  >
                    <div className="flex items-center justify-end">
                      Employees
                      {renderSortIndicator("employeesRange")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="hidden lg:table-cell cursor-pointer text-right"
                    onClick={() => handleSort("foundedAt")}
                  >
                    <div className="flex items-center justify-end">
                      Founded
                      {renderSortIndicator("foundedAt")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-center"
                    onClick={() => handleSort("stage")}
                  >
                    <div className="flex items-center justify-center">
                      Stage
                      {renderSortIndicator("stage")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCompanies.length > 0 ? (
                  paginatedCompanies.map((company) => (
                    <TableRow key={company._id}>
                      <TableCell className="font-medium">
                        {company.name}
                      </TableCell>
                      <TableCell>{company.sector || "—"}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {company.location || "—"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-right">
                        {company.employeesRange || "—"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-right">
                        {company.foundedAt
                          ? new Date(company.foundedAt).getFullYear()
                          : "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={company.stage ? "default" : "secondary"}
                        >
                          {company.stage || "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <SlidersHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => viewCompanyDetails(company._id)}
                            >
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/companies/${company._id}/edit`)
                              }
                            >
                              Edit company
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                  <ChevronsLeft className="h-4 w-4" />
                  <span className="sr-only">First page</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">{currentPage}</span>
                  <span className="text-sm text-muted-foreground">of</span>
                  <span className="text-sm font-medium">{totalPages || 1}</span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <ChevronsRight className="h-4 w-4" />
                  <span className="sr-only">Last page</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
