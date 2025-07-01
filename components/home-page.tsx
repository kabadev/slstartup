"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  ChevronRight,
  Download,
  TrendingUp,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import CompanyProfileSkeletonWithSidebar from "./CompanyProfileSkeletonWithSidebar";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function HomePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (user && !user?.publicMetadata?.onboardingCompleted) {
      if (pathname !== "/onboarding") {
        router.push("/onboarding");
        return;
      }
    } else if (user && user?.publicMetadata?.onboardingCompleted) {
      if (pathname === "/onboarding") {
        const role = user?.publicMetadata?.role;
        const companyId = user?.publicMetadata?.companyId;

        if (role === "investor") {
          router.push(`/investors/${companyId}`);
        } else {
          router.push(`/companies/${companyId}`);
        }
        return;
      }
    }

    setRedirecting(false);
  }, [isLoaded, pathname, user, router]);

  if (!isLoaded || redirecting) {
    return <CompanyProfileSkeletonWithSidebar />;
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-lg bg-primary text-primary-foreground">
        <div className="relative z-10 px-6 py-12 md:px-12 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
              Welcome to StartUpSL
            </h1>
            <p className="mb-8 text-lg md:text-xl">
              Your gateway to Sierra Leone's thriving startup ecosystem
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/companies">Explore Startups</Link>
              </Button>
              <Button
                className="text-gray-400"
                size="lg"
                variant="outline"
                asChild
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
        <Image
          src="/images/placeholder-logo.jpg?height=720&width=1280"
          alt="StartUpSL Hero"
          width={1280}
          height={720}
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
      </section>

      {/* Key Statistics */}
      <section>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">
          Ecosystem Overview
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Companies"
            value="934"
            icon={<Building2 className="h-4 w-4" />}
            description="+8% from last month"
            trend="up"
          />
          <StatCard
            title="Funding Rounds"
            value="99"
            icon={<TrendingUp className="h-4 w-4" />}
            description="+12% from last month"
            trend="up"
          />
          <StatCard
            title="Total Employees"
            value="50,403"
            icon={<Users className="h-4 w-4" />}
            description="+5% from last month"
            trend="up"
          />
          <StatCard
            title="VC Investment"
            value="$42M"
            icon={<BarChart3 className="h-4 w-4" />}
            description="+15% from last month"
            trend="up"
          />
        </div>
      </section>

      {/* Featured Sections */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Latest Startups</CardTitle>
            <CardDescription>
              Discover new companies in the ecosystem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <span>EcoHarvest</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/companies">
                    View <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </li>
              <li className="flex items-center justify-between">
                <span>PayQuick</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/companies">
                    View <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </li>
              <li className="flex items-center justify-between">
                <span>MediConnect</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/companies">
                    View <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Connect with the community</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Startup Pitch Night</p>
                  <p className="text-sm text-muted-foreground">May 15, 2024</p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/events">
                    Details <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Investor Meetup</p>
                  <p className="text-sm text-muted-foreground">May 22, 2024</p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/events">
                    Details <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Latest Resources</CardTitle>
            <CardDescription>Access reports and guides</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <span>Startup Ecosystem Report 2024</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/downloads">
                    Download <Download className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </li>
              <li className="flex items-center justify-between">
                <span>Funding Trends Q1 2024</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/downloads">
                    Download <Download className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Call to Action */}
      <section className="rounded-lg bg-muted p-6 md:p-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight">
            Join the StartUpSL Community
          </h2>
          <p className="mb-6 text-muted-foreground">
            Whether you're a founder, investor, or startup enthusiast, there's a
            place for you in our ecosystem.
          </p>
          <Button size="lg" asChild>
            <Link href="/about">
              Get Involved <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
