"use client";

import type React from "react";

import { SignOutButton, useUser } from "@clerk/nextjs";
import { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  Calendar,
  Download,
  Home,
  Info,
  Layers,
  Menu,
  TrendingUp,
  Users,
  Search,
  Users2,
  ShieldCheck,
  Share2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";

import { User } from "@clerk/nextjs/server";
import NotificationBell from "@/components/NotificationBell";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Sectors", href: "/sectors", icon: Layers },
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "Investors", href: "/investors", icon: Users },
  { name: "Funding Rounds", href: "/rounds", icon: TrendingUp },
  { name: "Downloads", href: "/downloads", icon: Download },
  // { name: "Admin", href: "/admin", icon: ShieldCheck },
  { name: "Other Platforms", href: "/other-platforms", icon: Share2 },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "About", href: "/about", icon: Info },
];

interface RootLayoutProps {
  children: React.ReactNode;
  notifications?: any[];
  unreadCount?: number;
}

export default function ClientLayout({
  children,
  notifications = [],
  unreadCount = 0,
}: RootLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;
  // if (!user) return null;

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center h-16 gap-4 px-4 sm:px-6 lg:px-8">
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>

          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-md">
              <img
                src="/images/startup-sl_logos2.png"
                alt="StartUp-SL Logo"
                className="object-contain w-full h-full rounded-md"
              />
            </div>
            <span className="text-xl font-bold">StartUp-SL</span>
          </Link>

          <div className="justify-center flex-1 hidden md:flex">
            <div className="relative w-full max-w-md">
              <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2 dark:text-gray-500" />
              <input
                type="search"
                placeholder="Search companies, investors, startups..."
                className="w-full pr-4 text-sm text-gray-800 placeholder-gray-400 transition-all duration-300 border border-gray-300 shadow-sm h-11 rounded-xl dark:border-gray-700 bg-white/70 dark:bg-white/10 backdrop-blur-md pl-11 dark:text-gray-100 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:ring-offset-0"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 ml-auto">
            <Button variant="ghost" size="icon" className="relative">
              <NotificationBell />

              <span className="sr-only">Notifications</span>
            </Button>
            <ThemeToggle />
            <div>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <UserButton />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-background">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem>
                      <Link
                        href={`${
                          user?.publicMetadata.role === "company"
                            ? "/companies/" + user?.publicMetadata.companyId
                            : "/investors/" + user?.publicMetadata.companyId
                        }`}
                      >
                        {user?.publicMetadata.role === "company"
                          ? " Company Details"
                          : " Investor Details"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={"/account"}>Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="mt-4 ">
                      <SignOutButton>
                        <Button className=" text-xs">Logout</Button>
                      </SignOutButton>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/sign-in">
                    <Button>Sign In</Button>
                  </Link>

                  <Link href="/sign-up">
                    <Button variant={"outline"} className="">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar and Main */}
      <div className="flex flex-1">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 sm:max-w-xs">
            <nav className="flex flex-col h-full border-r bg-muted/40">
              <div className="flex items-center px-4 border-b h-14">
                <Link href="/" className="flex items-center gap-2">
                  <img
                    src="/images/startup-sl_logos2.png"
                    alt="StartUp-SL Logo"
                    className="object-contain w-8 h-8 rounded-md"
                  />
                  <span className="text-lg font-bold">StartUpSL</span>
                </Link>
              </div>
              <div className="flex-1 py-2 overflow-auto">
                <div className="px-2 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        pathname === item.href
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        <aside className="fixed flex-col hidden w-64 h-full border-r bg-muted/40 lg:flex">
          <div className="flex-1 py-4 overflow-auto">
            <div className="px-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-auto md:ml-64">
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}
