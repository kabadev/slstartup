"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// import { getFilterOptions } from "@/lib/db-simulation";

export default function InvestorFilters({
  currentFilters,
  onFilterChange,
}: any) {
  const [sectors, setSectors] = useState([]);
  const [locations, setLocations] = useState([]);
  const [stages, setStages] = useState([]);
  const [fundingRange, setFundingRange] = useState([0, 1000000]);
  const [localFundingMin, setLocalFundingMin] = useState(
    currentFilters.fundingMin || ""
  );
  const [localFundingMax, setLocalFundingMax] = useState(
    currentFilters.fundingMax || ""
  );

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const options: any = {};
        setSectors(options.sectors || []);
        setLocations(options.locations || []);
        setStages(options.stages || []);
        setFundingRange([
          options.fundingRange?.min || 0,
          options.fundingRange?.max || 1000000,
        ]);
      } catch (error) {
        console.error("Failed to fetch filter options:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  // Handle sector change
  const handleSectorChange = (value: any) => {
    onFilterChange({ ...currentFilters, sector: value });
  };

  // Handle location change
  const handleLocationChange = (value: any) => {
    onFilterChange({ ...currentFilters, location: value });
  };

  // Handle stage change
  const handleStageChange = (value: any) => {
    onFilterChange({ ...currentFilters, stage: value });
  };

  // Handle funding min/max change
  const handleFundingChange = () => {
    onFilterChange({
      ...currentFilters,
      fundingMin: localFundingMin,
      fundingMax: localFundingMax,
    });
  };

  return (
    <Accordion
      type="multiple"
      defaultValue={["sector", "location", "stage", "funding"]}
      className="w-full"
    >
      <AccordionItem value="sector">
        <AccordionTrigger className="text-sm">Sector</AccordionTrigger>
        <AccordionContent>
          <Select
            value={currentFilters.sector}
            onValueChange={handleSectorChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All sectors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sectors</SelectItem>
              {sectors.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="location">
        <AccordionTrigger className="text-sm">Location</AccordionTrigger>
        <AccordionContent>
          <Select
            value={currentFilters.location}
            onValueChange={handleLocationChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="stage">
        <AccordionTrigger className="text-sm">
          Investment Stage
        </AccordionTrigger>
        <AccordionContent>
          <Select
            value={currentFilters.stage}
            onValueChange={handleStageChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All stages</SelectItem>
              {stages.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="funding">
        <AccordionTrigger className="text-sm">
          Funding Capacity
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="fundingMin" className="text-xs">
                  Min
                </Label>
                <Input
                  id="fundingMin"
                  type="number"
                  placeholder="Min"
                  value={localFundingMin}
                  onChange={(e) => setLocalFundingMin(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fundingMax" className="text-xs">
                  Max
                </Label>
                <Input
                  id="fundingMax"
                  type="number"
                  placeholder="Max"
                  value={localFundingMax}
                  onChange={(e) => setLocalFundingMax(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs"
              onClick={handleFundingChange}
            >
              Apply
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
