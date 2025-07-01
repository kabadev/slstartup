"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Utility to disable transitions temporarily
  function disableTransitionOnChange() {
    const root = document.documentElement;
    root.classList.add("[&_*]:!transition-none");

    // Remove it right after reflow
    setTimeout(() => {
      root.classList.add("[&_*]:!transition-none");
    }, 0);
  }

  const toggleTheme = () => {
    disableTransitionOnChange();
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}
