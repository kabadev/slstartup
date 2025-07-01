"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getInvestorsAction } from "@/app/actions/investor-actions";
import InvestorCard from "@/components/investor-card";
import InvestorFilters from "./investor-filters";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";

// Define the Investor type (adjust fields as per your data structure)
interface Investor {
  _id: string; // Ensure this property exists
  name: string;
  sector: string;
  location: string;
  // Add other fields as needed
}

interface Filters {
  sector?: string;
  location?: string;
  stage?: string;
  fundingMin?: string;
  fundingMax?: string;
}

// Import the Investor type from db-simulation
// import { Investor } from "@/lib/db-simulation";
// import  {Investor} from "@/lib/db-simulation";
import { Investor as DBInvestor } from "@/lib/db-simulation";

export default function InvestorDirectory() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery("(max-width: 768px)");

  //   const [investors, setInvestors] = useState<Investor[]>([]);
  const [investors, setInvestors] = useState<DBInvestor[]>([]); // Use the imported Investor type
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(!isMobile);

  // Get current filter values from URL
  const sector = searchParams.get("sector") || "";
  const location = searchParams.get("location") || "";
  const stage = searchParams.get("stage") || "";
  const fundingMin = searchParams.get("fundingMin") || "";
  const fundingMax = searchParams.get("fundingMax") || "";

  // Fetch investors
  useEffect(() => {
    const fetchInvestors = async () => {
      setLoading(true);
      try {
        const filters = {
          sectorInterested: sector || undefined,
          location: location || undefined,
          type: stage || undefined,
          fundingMin: fundingMin ? Number.parseInt(fundingMin) : undefined,
          fundingMax: fundingMax ? Number.parseInt(fundingMax) : undefined,
        };

        const response = await getInvestorsAction(filters);

        // Ensure response data matches the Investor[] type
        if (response.success) {
          setInvestors(response.data); // response.data should be of type Investor[]
        } else {
          console.error("Error fetching investors:", response.error);
          setInvestors([]); // Reset to an empty array on error
        }
      } catch (error) {
        console.error("Failed to fetch investors:", error);
        setInvestors([]); // Reset to an empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchInvestors();
  }, [sector, location, stage, fundingMin, fundingMax]);

  // Update URL with filters
  const updateFilters = (filters: Filters) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  // Check if any filters are active
  const hasActiveFilters =
    sector || location || stage || fundingMin || fundingMax;

  const renderFilters = () => (
    <div className="w-full lg:w-64 flex-shrink-0">
      <div className="sticky top-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 text-xs"
            >
              Clear all
              <X className="ml-1 h-3 w-3" />
            </Button>
          )}
        </div>

        <InvestorFilters
          currentFilters={{
            sector,
            location,
            stage,
            fundingMin,
            fundingMax,
          }}
          onFilterChange={updateFilters}
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Mobile filter button */}
      {isMobile && (
        <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="mb-4 w-full md:hidden">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 rounded-full bg-primary w-5 h-5 text-xs flex items-center justify-center text-primary-foreground">
                  {
                    Object.values({
                      sector,
                      location,
                      stage,
                      fundingMin,
                      fundingMax,
                    }).filter(Boolean).length
                  }
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px]">
            <ScrollArea className="h-[calc(100vh-80px)] pr-4">
              {renderFilters()}
            </ScrollArea>
          </SheetContent>
        </Sheet>
      )}

      {/* Desktop filters */}
      {!isMobile && renderFilters()}

      {/* Investors grid */}
      <div className="flex-1">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-lg bg-muted animate-pulse"
              ></div>
            ))}
          </div>
        ) : investors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {investors.map((investor: any) => (
              <InvestorCard key={investor?._id} investor={investor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <h3 className="text-lg font-medium">No investors found</h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your filters or check back later.
            </p>
            {hasActiveFilters && (
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function clearFilters() {
  const params = new URLSearchParams(window.location.search);
  params.delete("sector");
  params.delete("location");
  params.delete("stage");
  params.delete("fundingMin");
  params.delete("fundingMin");
  params.delete("fundingMax");

  window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
}
