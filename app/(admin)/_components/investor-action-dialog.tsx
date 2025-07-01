"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  XCircle,
  Pause,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { updateInvestorStatus } from "@/app/actions/investor-status-actions";

interface InvestorActionDialogProps {
  isOpen: boolean;
  action: "approved" | "rejected" | "suspended" | "deleted" | null;
  investorName: string;
  investorId: string;
  onClose: () => void;
  onComplete: () => void;
}

export function InvestorActionDialog({
  isOpen,
  action,
  investorName,
  investorId,
  onClose,
  onComplete,
}: InvestorActionDialogProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError("Please provide a reason for this action");
      return;
    }

    if (!action) return;

    setLoading(true);
    setError(null);

    try {
      const result = await updateInvestorStatus({
        investorId,
        action,
        reason: reason.trim(),
        actionBy: "Admin User", // In a real app, this would come from the current user session
      });

      if (result.success) {
        onComplete();
        handleClose();
      } else {
        setError(result.error || `Failed to ${action} investor`);
      }
    } catch (err) {
      setError(`Failed to ${action} investor`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReason("");
    setError(null);
    onClose();
  };

  const getActionConfig = (actionType: string) => {
    switch (actionType) {
      case "approved":
        return {
          title: "Approve Investor",
          description:
            "This investor will be marked as approved and can proceed with their application.",
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          buttonText: "Approve",
          buttonClass: "bg-green-600 hover:bg-green-700",
          placeholder:
            'Enter reason for approval (e.g., "All documents verified and requirements met")',
        };
      case "rejected":
        return {
          title: "Reject Investor",
          description:
            "This investor will be marked as rejected and notified of the decision.",
          icon: <XCircle className="h-5 w-5 text-red-600" />,
          buttonText: "Reject",
          buttonClass: "bg-red-600 hover:bg-red-700",
          placeholder:
            'Enter reason for rejection (e.g., "Insufficient documentation provided")',
        };
      case "suspended":
        return {
          title: "Suspend Investor",
          description:
            "This investor will be temporarily suspended pending further review.",
          icon: <Pause className="h-5 w-5 text-yellow-600" />,
          buttonText: "Suspend",
          buttonClass: "bg-yellow-600 hover:bg-yellow-700",
          placeholder:
            'Enter reason for suspension (e.g., "Under investigation for compliance issues")',
        };
      case "deleted":
        return {
          title: "Delete Investor",
          description:
            "This investor record will be permanently removed from the system.",
          icon: <Trash2 className="h-5 w-5 text-red-600" />,
          buttonText: "Delete",
          buttonClass: "bg-red-600 hover:bg-red-700",
          placeholder:
            'Enter reason for deletion (e.g., "Duplicate record or fraudulent application")',
        };
      default:
        return {
          title: "Update Investor",
          description: "Update the investor status.",
          icon: <AlertTriangle className="h-5 w-5" />,
          buttonText: "Update",
          buttonClass: "",
          placeholder: "Enter reason for this action",
        };
    }
  };

  if (!action) return null;

  const config = getActionConfig(action);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {config.icon}
            {config.title}
          </DialogTitle>
          <DialogDescription>
            <strong>{investorName}</strong>
            <br />
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {action === "deleted" && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Warning:</strong> This action cannot be undone. The
                investor record will be permanently removed.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Reason *</Label>
            <Textarea
              id="reason"
              placeholder={config.placeholder}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !reason.trim()}
            className={config.buttonClass}
          >
            {loading ? "Processing..." : config.buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
