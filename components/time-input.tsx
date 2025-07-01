"use client";

import type React from "react";

import { Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TimeInput({
  value,
  onChange,
  placeholder = "6:00 PM - 9:00 PM",
}: TimeInputProps) {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="flex items-center">
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
      />
      <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
    </div>
  );
}
