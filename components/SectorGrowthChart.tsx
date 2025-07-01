"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { colorMap } from "@/data/sectors";

interface SectorGrowthData {
  year: string;
  [key: string]: string | number;
}

interface SectorGrowthChartProps {
  data: SectorGrowthData[];
  sectors: string[]; // Ordered list of sectors to display
}

export default function SectorGrowthChart({
  data,
  sectors,
}: SectorGrowthChartProps) {
  // Limit to 10 sectors if there are more to avoid overcrowding
  const displaySectors = sectors.length > 10 ? sectors.slice(0, 10) : sectors;

  // Create color mapping for sectors
  const sectorColors: Record<string, string> = {};

  displaySectors.forEach((sector, index) => {
    // Try to match the sector with our color map based on the sector name
    const matchingColor = Object.entries(colorMap).find(([className, _]) => {
      const colorName = className.replace("bg-", "").split("-")[0];
      return sector.toLowerCase().includes(colorName.toLowerCase());
    });

    // Use the matching color or generate one based on index
    sectorColors[sector] = matchingColor
      ? matchingColor[1]
      : `hsl(${(index * 30) % 360}, 70%, 50%)`;
  });

  if (displaySectors.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#374151"
        />
        <XAxis
          dataKey="year"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#9CA3AF" }}
          tickMargin={10}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#9CA3AF" }}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                  <p className="font-medium text-gray-300">{label}</p>
                  <div className="mt-2 space-y-1">
                    {payload.map((entry, index) => (
                      <div
                        key={`item-${index}`}
                        className="flex items-center gap-2"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-gray-300">{entry.name}: </span>
                        <span className="font-medium text-white">
                          {entry.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          wrapperStyle={{ paddingTop: "20px" }}
        />
        {/* Render bars in the same order as the sectors array to match the display order */}
        {displaySectors.map((sector) => (
          <Bar
            key={sector}
            dataKey={sector}
            fill={sectorColors[sector]}
            radius={[4, 4, 0, 0]}
            name={sector}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
