"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Building2,
  MapPin,
  Calendar,
  Globe,
  Mail,
  Phone,
  DollarSign,
  Users,
  FileText,
  ExternalLink,
  CheckCircle,
  XCircle,
  Pause,
  Trash2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { getInvestorById } from "@/app/actions/investor-status-actions";
import { InvestorActionDialog } from "./investor-action-dialog";

interface InvestorDetailModalProps {
  investorId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onActionComplete?: () => void;
}

export function InvestorDetailModal({
  investorId,
  isOpen,
  onClose,
  onActionComplete,
}: InvestorDetailModalProps) {
  const [investor, setInvestor] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionDialog, setActionDialog] = useState<{
    isOpen: boolean;
    action: "approved" | "rejected" | "suspended" | "deleted" | null;
  }>({
    isOpen: false,
    action: null,
  });

  useEffect(() => {
    if (investorId && isOpen) {
      fetchInvestorDetails();
    }
  }, [investorId, isOpen]);

  const fetchInvestorDetails = async () => {
    if (!investorId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getInvestorById(investorId);
      if (result.success) {
        setInvestor(result.investor);
      } else {
        setError(result.error || "Failed to fetch investor details");
      }
    } catch (err) {
      setError("Failed to fetch investor details");
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (
    action: "approved" | "rejected" | "suspended" | "deleted"
  ) => {
    setActionDialog({ isOpen: true, action });
  };

  const handleActionComplete = () => {
    setActionDialog({ isOpen: false, action: null });
    fetchInvestorDetails(); // Refresh data
    onActionComplete?.();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "suspended":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Investor Details</DialogTitle>
            <DialogDescription>
              View and manage investor information and status
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-120px)]">
            {loading ? (
              <div className="space-y-6 p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            ) : error ? (
              <Alert variant="destructive" className="m-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : investor ? (
              <div className="space-y-6 p-4">
                {/* Header Section */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={investor.logo || "/placeholder.svg"}
                        alt={investor.name}
                      />
                      <AvatarFallback className="text-lg">
                        {investor.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">{investor.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{investor.type}</Badge>
                        <Badge
                          className={getStatusColor(
                            investor.status || "pending"
                          )}
                        >
                          {investor.status || "pending"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleActionClick("approved")}
                      disabled={investor.status === "approved"}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleActionClick("rejected")}
                      disabled={investor.status === "rejected"}
                      className="border-red-200 text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleActionClick("suspended")}
                      disabled={investor.status === "suspended"}
                      className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Suspend
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleActionClick("deleted")}
                      disabled={investor.status === "deleted"}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Location:</span>
                        <span className="text-sm">
                          {investor.location || "Not specified"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Founded:</span>
                        <span className="text-sm">
                          {investor.foundedAt || "Not specified"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">AUM:</span>
                        <span className="text-sm font-semibold">
                          {formatCurrency(investor.amountRaised || 0)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Website:</span>
                        {investor.website ? (
                          <a
                            href={investor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            {investor.website}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Not specified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Email:</span>
                        <span className="text-sm">
                          {investor.email || "Not specified"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Phone:</span>
                        <span className="text-sm">
                          {investor.phone || "Not specified"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Investment Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Investment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium">
                          Investment Stage:
                        </span>
                        <div className="mt-1">
                          <Badge variant="default">
                            {investor.stage || "Not specified"}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium">
                          Funding Capacity:
                        </span>
                        <p className="text-sm mt-1">
                          {investor.fundingCapacity || "Not specified"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium">
                        Sectors of Interest:
                      </span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {investor.sectorInterested?.map((sector: string) => (
                          <Badge key={sector} variant="outline">
                            {sector}
                          </Badge>
                        )) || (
                          <span className="text-sm text-muted-foreground">
                            Not specified
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium">
                        Investment Goals:
                      </span>
                      <p className="text-sm mt-1 text-muted-foreground">
                        {investor.goalExpected || "Not specified"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                {investor.description && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Description
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {investor.description}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Status History */}
                {investor.statusHistory &&
                  investor.statusHistory.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          Status History
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {investor.statusHistory.map(
                            (history: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      className={getStatusColor(history.action)}
                                    >
                                      {history.action}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                      by {history.actionBy}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatDate(history.actionDate)}
                                    </span>
                                  </div>
                                  <p className="text-sm mt-1">
                                    {history.reason}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                {/* Social Links */}
                {investor.socialLinks && investor.socialLinks.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Social Links
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {investor.socialLinks.map(
                          (link: any, index: number) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <a
                                href={link.link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {link.name}
                                <ExternalLink className="h-3 w-3 ml-2" />
                              </a>
                            </Button>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : null}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <InvestorActionDialog
        isOpen={actionDialog.isOpen}
        action={actionDialog.action}
        investorName={investor?.name || ""}
        investorId={investorId || ""}
        onClose={() => setActionDialog({ isOpen: false, action: null })}
        onComplete={handleActionComplete}
      />
    </>
  );
}
