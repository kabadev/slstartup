"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarIcon,
  Download,
  Edit,
  Share2,
  Trash2,
  Users,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
// import { useRounds } from "@/context/rounds-context";
import { useRounds } from "@/contexts/rounds-context";
import { RoundFormData } from "@/types/types";
import { deleteRound } from "@/app/actions/round-actions";
import InvestmentInterestsTable from "./investment-interests-table";
import { useUser } from "@clerk/nextjs";

// Helper function to get status badge color
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "draft":
      return "bg-gray-200 text-gray-800";
    case "under review":
      return "bg-yellow-100 text-yellow-800";
    case "open":
      return "bg-green-100 text-green-800";
    case "closed":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

export default function RoundDetail({
  round,
  interests,
}: {
  round: RoundFormData;
  interests: any;
}) {
  const { user } = useUser();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  async function handleDelete() {
    try {
      await deleteRound(round._id!);
      toast({
        title: "Round deleted",
        description: "The funding round has been permanently deleted.",
        variant: "destructive",
      });
      window.location.href = "/rounds";
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete round",
        variant: "destructive",
      });
    }
  }

  if (!round) {
    return (
      <div className="py-8 ">
        <Card>
          <CardContent className="pt-6">
            <p>
              Round not found. The round may have been deleted or you don't have
              permission to view it.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/rounds">Back to Rounds</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressPercentage = 0;

  return (
    <div className="p-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-4 mb-6 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{round.roundTitle}</h1>
            <Badge className={getStatusColor(round.roundStatus)}>
              {round.roundStatus}
            </Badge>
          </div>

          <p className="mt-1 text-muted-foreground"> {round.companyName}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/rounds">Back to Rounds</Link>
          </Button>

          {round.userId! === user?.id ||
            (user?.publicMetadata?.isAdmin! && (
              <Button variant="outline" size="icon" asChild>
                <Link href={`/round/${round?._id}/edit`}>
                  <Edit className="w-4 h-4" />
                </Link>
              </Button>
            ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="w-4 h-4 mr-2" />
                Share with Investors
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Copy Link</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {round.userId! === user?.id ||
            (user?.publicMetadata?.isAdmin! && (
              <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this funding round and all
                      associated data. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete Round
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ))}
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle>Funding Progress</CardTitle>
          <CardDescription>
            {round.raisedAmount} raised of {round.fundingGoal} goal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{progressPercentage}% Complete</span>
              <span>
                <CalendarIcon className="inline-block w-4 h-4 mr-1" />
                {format(new Date(round.closingDate), "PPP")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Details */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column - Key Details */}
        <div className="space-y-8 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Round Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Round Type
                  </h3>
                  <p>{round.roundType}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Company Stage
                  </h3>
                  <p>{round.companyStage}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Valuation
                  </h3>
                  <p>{round.valuation || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Equity Offered
                  </h3>
                  <p>{round.equityOffered || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Minimum Investment
                  </h3>
                  <p>{round.minimumInvestment || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Contact Person
                  </h3>
                  <p>{round.contactPerson}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Open Date
                  </h3>
                  <p>{format(new Date(round.openDate), "PPP")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Closing Date
                  </h3>
                  <p>{format(new Date(round.closingDate), "PPP")}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                  Use of Funds
                </h3>
                <p className="text-sm">{round.useOfFunds}</p>
              </div>

              {round.supportingDocuments && (
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                    Supporting Documents
                  </h3>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download Pitch Deck
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Timeline & Actions */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Round Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 space-y-6 border-l">
                <div className="relative">
                  <div className="absolute -left-[25px] h-4 w-4 rounded-full bg-green-500"></div>
                  <h4 className="font-medium">Round Created</h4>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(round.createdAt!), "PPP")}
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[25px] h-4 w-4 rounded-full bg-green-500"></div>
                  <h4 className="font-medium">Round Opened</h4>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(round.openDate), "PPP")}
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[25px] h-4 w-4 rounded-full bg-gray-300"></div>
                  <h4 className="font-medium">Round Closing</h4>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(round.closingDate), "PPP")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {user?.publicMetadata?.role === "investor" && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full">
                  <Link href={`/investor-interest/${round._id}`}>
                    Show Interest
                  </Link>
                </Button>
                {/* <Button variant="outline" className="w-full">
                Generate Term Sheet
              </Button>
              <Button variant="outline" className="w-full">
                Schedule Investor Call
              </Button> */}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {round.userId === user?.id && (
        <div>
          <InvestmentInterestsTable interests={interests} />
        </div>
      )}
    </div>
  );
}
