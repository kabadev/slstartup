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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Select } from "@radix-ui/react-select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Plus,
  Search,
} from "lucide-react";
import Link from "next/link";

export default function Loading() {
  return (
    <div className=" px-4 py-6">
      <Card className="w-full border-none">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
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
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search companies..."
                    className="pl-8 w-full"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  ></Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <table className="w-full table-auto border-collapse text-left">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="p-4 font-normal">Company Name</th>
                    <th className="p-4 font-normal">Sector</th>
                    <th className="p-4 font-normal">Stage</th>
                    <th className="p-4 font-normal">Created At</th>
                    <th className="p-4 font-normal">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {/* Loading rows */}
                  {Array.from({ length: 8 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="p-4">
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <div className="flex-1 text-sm text-muted-foreground">
                Showing <strong>0</strong> to <strong>0</strong> of{" "}
                <strong>0</strong> companies
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <Select>
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue />
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
                  <Button variant="outline" size="icon">
                    <ChevronsLeft className="h-4 w-4" />
                    <span className="sr-only">First page</span>
                  </Button>
                  <Button variant="outline" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous page</span>
                  </Button>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">1</span>
                    <span className="text-sm text-muted-foreground">of</span>
                    <span className="text-sm font-medium">1</span>
                  </div>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next page</span>
                  </Button>
                  <Button variant="outline" size="icon">
                    <ChevronsRight className="h-4 w-4" />
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
