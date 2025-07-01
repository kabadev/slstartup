// "use client";

// import type React from "react";

// import { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   BarChart3,
//   Building2,
//   Calendar,
//   Download,
//   FileText,
//   Home,
//   Info,
//   Layers,
//   Menu,
//   TrendingUp,
//   Users,
//   X,
//   Search,
//   Bell,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
// import { cn } from "@/lib/utils";
// import { currentUser } from "@clerk/nextjs/server";
// import { getUserNotifications } from "@/app/actions/notification-actions";
// import { UserButton, useUser } from "@clerk/nextjs";
// import { ModeToggle } from "@/components/ui/mode-toggle";
// import { ThemeToggle } from "@/components/theme-toggle";
// import { NotificationBell } from "@/components/notification-bell";

// const navigation = [
//   { name: "Home", href: "/", icon: Home },
//   { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
//   { name: "Sectors", href: "/sectors", icon: Layers },
//   { name: "Companies", href: "/companies", icon: Building2 },
//   { name: "Investors", href: "/investors", icon: Users },
//   { name: "Funding Rounds", href: "/rounds", icon: TrendingUp },
//   { name: "Downloads", href: "/downloads", icon: Download },
//   { name: "Events", href: "/events", icon: Calendar },
//   { name: "About", href: "/about", icon: Info },
// ];

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const pathname = usePathname();

//   const user = await currentUser();

//   if (!user) {
//     return (
//       <div className="flex items-center justify-between gap-4 ml-auto">
//         <Button size="sm">Sign In</Button>
//       </div>
//     );
//   }

//   const userId = user.id;

//   const { notifications, unreadCount } = await getUserNotifications(userId);

//   return (
//     <div>
//       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="flex items-center h-16 gap-4 px-4 sm:px-6 lg:px-8">
//           <Button
//             variant="outline"
//             size="icon"
//             className="lg:hidden"
//             onClick={() => setSidebarOpen(true)}
//           >
//             <Menu className="w-5 h-5" />
//             <span className="sr-only">Toggle menu</span>
//           </Button>
//           <div className="flex items-center gap-2">
//             <Link href="/" className="flex items-center gap-2">
//               <div className="flex items-center justify-center w-8 h-8 rounded-md">
//                 <img
//                   src="/images/startup-sl_logos2.png"
//                   alt="StartUp-SL Logo"
//                   className="object-contain w-full h-full rounded-md"
//                 />
//               </div>
//               <span className="text-xl font-bold">StartUp-SL</span>
//             </Link>
//           </div>

//           <div className="justify-center flex-1 hidden md:flex">
//             <div className="relative w-full max-w-md">
//               <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2 dark:text-gray-500" />
//               <input
//                 type="search"
//                 placeholder="Search companies, investors, startups..."
//                 className="w-full pr-4 text-sm text-gray-800 placeholder-gray-400 transition-all duration-300 border border-gray-300 shadow-sm h-11 rounded-xl dark:border-gray-700 // bg-white/70 dark:bg-white/10 backdrop-blur-md pl-11 dark:text-gray-100 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:ring-offset-0"
//               />
//             </div>
//           </div>

//           {user ? (
//             <div className="flex items-center justify-between gap-4 ml-auto">
//               <Button variant="ghost" size="icon" className="relative">
//                 <NotificationBell
//                   userId={user.id}
//                   initialNotifications={notifications}
//                   unreadCount={unreadCount}
//                   onNewNotification={handleNewNotification}
//                 />
//                 <span className="sr-only">Notifications</span>
//               </Button>
//               <ThemeToggle />
//               <UserButton />
//             </div>
//           ) : (
//             <div className="flex items-center justify-between gap-4 ml-auto">
//               <Button size="sm">Sign In</Button>
//             </div>
//           )}
//         </div>
//       </header>

//       <div className="flex flex-1">
//         <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
//           <SheetTitle className=""></SheetTitle>
//           <SheetContent side="left" className="p-0 sm:max-w-xs">
//             <nav className="flex flex-col h-full border-r bg-muted/40">
//               <div className="flex items-center px-4 border-b h-14">
//                 <Link href="/" className="flex items-center gap-2">
//                   <div className="flex items-center justify-center w-8 h-8 rounded-md">
//                     {/* <FileText className="w-4 h-4" /> */}
//                     <img
//                       src="/images/startup-sl_logos2.png"
//                       alt="StartUp-SL Logo"
//                       className="object-contain w-full h-full rounded-md"
//                     />
//                   </div>
//                   <span className="text-lg font-bold">StartUpSL</span>
//                 </Link>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="ml-auto lg:hidden"
//                   onClick={() => setSidebarOpen(false)}
//                 >
//                   {/* <X className="w-5 h-5" /> */}
//                   <span className="sr-only">Close sidebar</span>
//                 </Button>
//               </div>
//               <div className="flex-1 py-2 overflow-auto">
//                 <div className="px-2 space-y-1">
//                   {navigation.map((item) => (
//                     <Link
//                       key={item.name}
//                       href={item.href}
//                       className={cn(
//                         "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
//                         pathname === item.href
//                           ? "bg-accent text-accent-foreground"
//                           : "text-muted-foreground"
//                       )}
//                     >
//                       <item.icon className="w-4 h-4" />
//                       {item.name}
//                     </Link>
//                   ))}
//                 </div>
//               </div>
//             </nav>
//           </SheetContent>
//         </Sheet>

//         <aside className="fixed flex-col hidden w-64 h-full border-r bg-muted/40 lg:flex">
//           <div className="flex-1 py-4 overflow-auto">
//             <div className="px-3 space-y-1">
//               {navigation.map((item) => (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className={cn(
//                     "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
//                     pathname === item.href
//                       ? "bg-accent text-accent-foreground"
//                       : "text-muted-foreground"
//                   )}
//                 >
//                   <item.icon className="w-4 h-4" />
//                   {item.name}
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </aside>

//         <main className="flex-1 overflow-auto md:ml-64">{children}</main>
//       </div>
//     </div>
//   );
// }

import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import ClientLayout from "./clientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StartUp-SL",
  description: "Generated by create next app",
};

interface RootLayoutProps {
  children: React.ReactNode;
  notifications?: any[];
  unreadCount?: number;
}

export default function RootLayout({
  children,
  notifications = [],
  unreadCount = 0,
}: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout notifications={notifications} unreadCount={unreadCount}>
          {children}
          <Toaster />
        </ClientLayout>
      </body>
    </html>
  );
}
