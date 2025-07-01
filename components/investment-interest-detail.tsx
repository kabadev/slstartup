"use client";

import type React from "react";

import { useState } from "react";
import {
  Check,
  X,
  Mail,
  Phone,
  Building,
  DollarSign,
  Target,
  MessageSquare,
  User,
  Award,
  Clock,
  ArrowLeft,
  Upload,
  FileText,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateInterestData } from "@/app/actions/investor-interest-action";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

// Mock data - replace with actual data from props
const mockInterestData = {
  id: "interest_123",
  status: "pending", // pending, accepted, rejected
  submittedAt: "2024-01-15T10:30:00Z",

  // Personal Information
  fullName: "Sarah Johnson",
  email: "sarah.johnson@venturecap.com",
  phone: "+1 (555) 123-4567",
  company: "Venture Capital Partners",

  // Investor Profile
  investorType: "Venture Capital",
  investmentExperience: "experienced",

  // Investment Details
  investmentRange: "$500K - $1M",
  timeframe: "3-6 months",
  investmentGoals: ["growth", "strategic", "diversification"],

  // Additional Information
  investmentThesis:
    "I'm particularly interested in this company's innovative approach to sustainable technology. The market opportunity is significant, and the team has demonstrated strong execution capabilities. I believe this investment aligns perfectly with our portfolio strategy focusing on climate tech solutions.",
  questions:
    "What are the key milestones for the next 18 months? How do you plan to scale the team?",
  hasPreviousInvestments: true,
  previousInvestments:
    "Previous investments include GreenTech Solutions ($2M Series A), EcoInnovate ($1.5M Seed), and CleanEnergy Corp ($3M Series B).",
  contactPreference: "both",

  // Company/Round Info
  companyName: "EcoTech Innovations",
  roundType: "Series A",

  // User IDs for comparison
  interestUserId: "user_123",
  loginUserId: "user_123", // Change this to test different scenarios
};

const investmentGoalLabels = {
  growth: "Growth & Expansion",
  income: "Regular Income",
  strategic: "Strategic Partnership",
  acquisition: "Potential Acquisition",
  diversification: "Portfolio Diversification",
};

const experienceLabels = {
  none: "No Prior Experience",
  beginner: "Beginner (1-2 investments)",
  intermediate: "Intermediate (3-10 investments)",
  experienced: "Experienced (10+ investments)",
};

const declineReasonOptions = [
  "Investment amount doesn't align with our current funding needs",
  "We're looking for investors with different expertise or network",
  "Timeline doesn't match our fundraising schedule",
  "We've already secured sufficient funding for this round",
  "Investment terms don't align with our current valuation",
  "We're seeking strategic investors with specific industry experience",
  "Current focus is on different geographic markets",
  "We need more time to evaluate all potential investors",
];

export default function InvestmentInterestDetail({ interest }: any) {
  const router = useRouter();
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [termSheet, setTermSheet] = useState<File | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [selectedDeclineReasons, setSelectedDeclineReasons] = useState<
    string[]
  >([]);

  const [actionTaken, setActionTaken] = useState<
    "accepted" | "declined" | null
  >(null);
  const [finalResponseMessage, setFinalResponseMessage] = useState("");
  const [uploadedTermSheet, setUploadedTermSheet] = useState<File | null>(null);
  const [finalDeclineReasons, setFinalDeclineReasons] = useState<string[]>([]);

  const isOwner = interest?.userId === user?.id!;
  const canTakeAction =
    interest.companyId === user?.publicMetadata?.companyId! &&
    interest?.status === "pending";

  const handleAccept = () => {
    setShowAcceptModal(true);
  };

  const handleConfirmAccept = async () => {
    setIsProcessing(true);
    try {
      // Simulate API call with term sheet upload
      const formData = new FormData();
      if (termSheet) {
        formData.append("termSheet", termSheet);
      }
      formData.append("responseMessage", responseMessage);
      formData.append("interestId", interest?._id);

      const updateData = {
        status: "accepted",
        responseMessage: responseMessage,
        termSheet: "termsheet url",
      };
      const result = await updateInterestData(interest?._id, updateData);
      if (result.success) {
        router.refresh();
        alert("Interest accepted successfully! Term sheet uploaded.");
        setShowAcceptModal(false);
        setTermSheet(null);
        setResponseMessage("");
      }
    } catch (error) {
      console.error("Error accepting interest:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = () => {
    setShowDeclineModal(true);
  };

  const handleConfirmDecline = async () => {
    if (selectedDeclineReasons.length === 0 && !declineReason.trim()) {
      alert("Please select at least one reason or provide a custom reason.");
      return;
    }

    setIsProcessing(true);
    try {
      const reasons =
        selectedDeclineReasons.length > 0
          ? selectedDeclineReasons.join("; ")
          : declineReason;

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store the response data
      setFinalResponseMessage(declineReason);
      setFinalDeclineReasons([...selectedDeclineReasons]);
      setActionTaken("declined");

      alert("Response sent to investor.");
      setShowDeclineModal(false);
      setDeclineReason("");
      setSelectedDeclineReasons([]);
      setResponseMessage("");
    } catch (error) {
      console.error("Error declining interest:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (PDF, DOC, DOCX)
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a PDF or Word document.");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB.");
        return;
      }

      setTermSheet(file);
    }
  };

  const handleDeclineReasonToggle = (reason: string) => {
    setSelectedDeclineReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge className="text-green-800 bg-green-100">Accepted</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending Review</Badge>;
    }
  };
  // alert(interest.roundTitle);

  return (
    <div className="p-6 space-y-6 ">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/round/${interest?.roundId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Interests
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Investment Interest Details</h1>
          <p>
            Interest to <b>{interest?.companyData?.name}</b> for the{" "}
            <b>{interest?.round?.name}</b>
          </p>
          <p className="mt-1 text-muted-foreground">
            Submitted on {new Date(interest?.createdAt).toLocaleDateString()}
          </p>
        </div>
        {interest.roundTitle}
        <div className="flex items-center gap-4 ">
          {getStatusBadge(interest?.status)}
          {isOwner && interest?.status === "pending" && <Button>Edit</Button>}
        </div>
      </div>

      {/* Investor Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 !rounded-md">
              <AvatarFallback className="text-lg !rounded-md">
                {interest?.fullName
                  ?.split(" ")
                  ?.map((n: any) => n[0])
                  ?.join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{interest?.fullName}</CardTitle>
              <CardDescription className="text-base">
                {interest?.company}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="flex items-center gap-2 mb-3 font-semibold">
              <User className="w-4 h-4" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{interest?.email}</span>
                {/* <span>{interest?.contactPerson}</span> */}
              </div>
              {interest?.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{interest?.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Building className="w-4 h-4 text-muted-foreground" />
                <span>{interest?.company}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <span>
                  Prefers{" "}
                  {interest?.contactPreference === "both"
                    ? "email & phone"
                    : interest?.contactPreference}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Investor Profile */}
          <div>
            <h3 className="flex items-center gap-2 mb-3 font-semibold">
              <Award className="w-4 h-4" />
              Investor Profile
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Investor Type
                </Label>
                <p className="mt-1 text-sm">{interest?.investorType}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Experience Level
                </Label>
                <p className="mt-1 text-sm">
                  {
                    experienceLabels[
                      interest?.investmentExperience as keyof typeof experienceLabels
                    ]
                  }
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Investment Details */}
          <div>
            <h3 className="flex items-center gap-2 mb-3 font-semibold">
              <DollarSign className="w-4 h-4" />
              Investment Details
            </h3>
            <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Investment Range
                </Label>
                <p className="mt-1 text-sm font-medium">
                  {interest?.investmentRange}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Timeframe
                </Label>
                <p className="mt-1 text-sm">{interest?.timeframe}</p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Investment Goals
              </Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {interest?.investmentGoals?.map((goal: string) => (
                  <Badge key={goal} variant="outline" className="text-xs">
                    {
                      investmentGoalLabels[
                        goal as keyof typeof investmentGoalLabels
                      ]
                    }
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Investment Thesis */}
          <div>
            <h3 className="flex items-center gap-2 mb-3 font-semibold">
              <Target className="w-4 h-4" />
              Investment Thesis
            </h3>
            <p className="p-4 text-sm leading-relaxed rounded-lg bg-muted/50">
              {interest?.investmentThesis}
            </p>
          </div>

          {/* Previous Investments */}
          {interest?.hasPreviousInvestments &&
            interest?.previousInvestments && (
              <>
                <Separator />
                <div>
                  <h3 className="mb-3 font-semibold">Previous Investments</h3>
                  <p className="p-4 text-sm leading-relaxed rounded-lg bg-muted/50">
                    {interest?.previousInvestments}
                  </p>
                </div>
              </>
            )}

          {/* Questions */}
          {interest?.questions && (
            <>
              <Separator />
              <div>
                <h3 className="mb-3 font-semibold">Questions</h3>
                <p className="p-4 text-sm leading-relaxed rounded-lg bg-muted/50">
                  {interest?.questions}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Accept/Reject Area or Response Summary */}
      {canTakeAction && interest.status === "pending" && (
        <Card className="border-2 border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Action Required
            </CardTitle>
            <CardDescription>
              Review this investment interest and decide whether to accept or
              decline.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="response-message">
                Response Message (Optional)
              </Label>
              <Textarea
                id="response-message"
                placeholder="Add a personal message to the investor..."
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAccept}
                disabled={isProcessing}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-current rounded-full animate-spin border-t-transparent" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-white ">
                    <Check className="w-4 h-4" />
                    Accept Interest
                  </span>
                )}
              </Button>

              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-current rounded-full animate-spin border-t-transparent" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <X className="w-4 h-4" />
                    Decline Interest
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Response Summary - Shown after action is taken */}
      {interest?.status !== "pending" && (
        <Card
          className={`border-2 ${
            interest.status === "accepted"
              ? "border-green-200 bg-green-50 dark:bg-green-500/10"
              : "border-red-200 bg-red-50 dark:bg-red-500/10"
          }`}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {interest?.status === "accepted" ? (
                <>
                  <Check className="w-5 h-5 text-green-600" />
                  Interest Accepted
                </>
              ) : (
                <>
                  <X className="w-5 h-5 text-orange-600" />
                  Interest Declined
                </>
              )}
            </CardTitle>
            <CardDescription>
              {interest?.status === "accepted"
                ? `You have accepted this investment interest on ${new Date().toLocaleDateString()}.`
                : `You have declined this investment interest on ${new Date().toLocaleDateString()}.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Response Message */}
            {finalResponseMessage && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Your Message
                </Label>
                <div className="p-3 mt-2 text-sm bg-white border rounded-lg">
                  {finalResponseMessage}
                </div>
              </div>
            )}

            {/* Term Sheet (for accepted interests) */}
            {actionTaken === "accepted" && uploadedTermSheet && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Term Sheet Uploaded
                </Label>
                <div className="flex items-center gap-3 p-3 mt-2 bg-white border rounded-lg">
                  <FileText className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {uploadedTermSheet.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadedTermSheet.size / 1024 / 1024).toFixed(2)} MB •
                      Uploaded {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            )}

            {/* Decline Reasons (for declined interests) */}
            {actionTaken === "declined" && finalDeclineReasons.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Reasons Provided
                </Label>
                <div className="mt-2 space-y-2">
                  {finalDeclineReasons.map((reason, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-2 text-sm border rounded"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0 text-red-500" />
                      {reason}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action timestamp */}
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Action completed on {new Date().toLocaleString()} •
                {actionTaken === "accepted"
                  ? " Investor will be notified via email"
                  : " Feedback sent to investor"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Opportunity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Company
              </Label>
              <p className="mt-1 text-sm font-medium">
                {interest?.companyName}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Funding Round
              </Label>
              <p className="mt-1 text-sm">{interest?.roundType}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accept Modal with Term Sheet Upload */}
      <Dialog open={showAcceptModal} onOpenChange={setShowAcceptModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              Accept Investment Interest
            </DialogTitle>
            <DialogDescription>
              You're about to accept this investment interest. You can
              optionally upload a term sheet and add a personal message.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Term Sheet Upload */}
            <div>
              <Label className="text-sm font-medium">
                Term Sheet (Optional)
              </Label>
              <div className="mt-2">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {termSheet ? (
                        <>
                          <FileText className="w-8 h-8 mb-2 text-green-600" />
                          {/* <p className="text-sm font-medium text-gray-600">
                            {termSheet.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(termSheet.size / 1024 / 1024).toFixed(2)} MB
                          </p> */}
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mb-2 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            term sheet
                          </p>
                          <p className="text-xs text-gray-500">
                            PDF, DOC, or DOCX (MAX. 10MB)
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
                {termSheet && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setTermSheet(null)}
                  >
                    Remove File
                  </Button>
                )}
              </div>
            </div>

            {/* Response Message */}
            <div>
              <Label htmlFor="accept-message">Personal Message</Label>
              <Textarea
                id="accept-message"
                placeholder="Welcome to our funding round! We're excited to work with you..."
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAcceptModal(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAccept}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-current rounded-full animate-spin border-t-transparent" />
                  Processing...
                </span>
              ) : (
                "Confirm Accept"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decline Modal with Gentle Reasons */}
      <Dialog open={showDeclineModal} onOpenChange={setShowDeclineModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Decline Investment Interest
            </DialogTitle>
            <DialogDescription>
              We understand that not every investment opportunity is the right
              fit. Please help us provide constructive feedback to the investor.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Predefined Gentle Reasons */}
            <div>
              <Label className="block mb-3 text-sm font-medium">
                Please select the reason(s) that best describe your decision:
              </Label>
              <div className="space-y-2 overflow-y-auto max-h-48">
                {declineReasonOptions.map((reason, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <input
                      title="Reason"
                      type="checkbox"
                      id={`reason-${index}`}
                      checked={selectedDeclineReasons.includes(reason)}
                      onChange={() => handleDeclineReasonToggle(reason)}
                      className="mt-1"
                    />
                    <Label
                      htmlFor={`reason-${index}`}
                      className="text-sm leading-relaxed cursor-pointer"
                    >
                      {reason}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Reason */}
            <div>
              <Label htmlFor="custom-reason">
                Additional Comments (Optional)
              </Label>
              <Textarea
                id="custom-reason"
                placeholder="Thank you for your interest in our company. While we appreciate your proposal, we've decided to..."
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                className="mt-2"
                rows={4}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Your message will be sent to the investor along with the
                selected reasons above.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeclineModal(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDecline}
              disabled={
                isProcessing ||
                (selectedDeclineReasons.length === 0 && !declineReason.trim())
              }
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-current rounded-full animate-spin border-t-transparent" />
                  Sending...
                </span>
              ) : (
                "Send Response"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
