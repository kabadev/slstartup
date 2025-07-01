"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { HandCoins } from "lucide-react";

interface InterestButtonProps extends ButtonProps {
  companyId: string;
  className?: string;
}

export default function InterestButton({
  companyId,
  className,
  ...props
}: InterestButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/companies/${companyId}/interest`);
  };

  return (
    <Button onClick={handleClick} className={className} {...props}>
      <HandCoins className="mr-2 h-4 w-4" />
      Express Interest
    </Button>
  );
}
