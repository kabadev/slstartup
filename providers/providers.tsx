"use client";

import { CompanyProvider } from "../contexts/company-context";
import { InvestorProvider } from "../contexts/investor-context";
import { type ReactNode, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { RoundsProvider } from "@/contexts/rounds-context";
import CompanyProfileSkeletonWithSidebar from "@/components/CompanyProfileSkeletonWithSidebar";

export function Providers({ children }: { children: ReactNode }) {
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
    <RoundsProvider>
      <CompanyProvider>
        <InvestorProvider>{children}</InvestorProvider>
      </CompanyProvider>
    </RoundsProvider>
  );
}
