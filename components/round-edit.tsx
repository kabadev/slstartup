"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, ChevronLeft, Trash2, Upload } from "lucide-react";
import { format } from "date-fns";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "@/components/ui/use-toast";
// import { useRounds } from "@/context/rounds-context";

// import type { RoundFormData } from "@/lib/types";
import { useRounds } from "@/contexts/rounds-context";
import { RoundFormData } from "@/types/types";

const formSchema = z.object({
  roundTitle: z.string().min(2, {
    message: "Round title must be at least 2 characters.",
  }),
  roundType: z.string({
    required_error: "Please select a round type.",
  }),
  fundingGoal: z.string().min(1, {
    message: "Please enter a funding goal.",
  }),
  valuation: z.string().optional(),
  equityOffered: z.string().optional(),
  minimumInvestment: z.string().optional(),
  useOfFunds: z.string().min(10, {
    message:
      "Please provide details on how the funds will be used (min 10 characters).",
  }),
  supportingDocuments: z.string().optional(),
  openDate: z.date({
    required_error: "Please select an open date.",
  }),
  closingDate: z.date({
    required_error: "Please select a closing date.",
  }),
  companyStage: z.string({
    required_error: "Please select a company stage.",
  }),
  roundStatus: z.string({
    required_error: "Please select a round status.",
  }),
  contactPerson: z.string().min(2, {
    message: "Contact person must be at least 2 characters.",
  }),
});

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

export default function RoundEdit({ round }: { round: RoundFormData }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] =
    useState(false);
  const { state, actions } = useRounds();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // Default values will be set after fetching the round
    defaultValues: {
      roundTitle: round.roundTitle,
      roundType: round.roundType,
      fundingGoal: round.fundingGoal,
      valuation: round.valuation || "",
      equityOffered: round.equityOffered || "",
      minimumInvestment: round.minimumInvestment || "",
      useOfFunds: round.useOfFunds,
      supportingDocuments: round.supportingDocuments || "",
      openDate: new Date(round.openDate),
      closingDate: new Date(round.closingDate),
      companyStage: round.companyStage,
      roundStatus: round.roundStatus,
      contactPerson: round.contactPerson,
    },
  });

  // Fetch round data when component mounts
  // useEffect(() => {
  //   actions.fetchRound(roundId);

  //   return () => {
  //     actions.clearround();
  //   };
  // }, [roundId, actions]);

  // Set form values when round data is loaded
  // useEffect(() => {
  //   if (round) {
  //     form.reset({
  //       roundTitle: round.roundTitle,
  //       roundType: round.roundType,
  //       fundingGoal: round.fundingGoal,
  //       valuation: round.valuation || "",
  //       equityOffered: round.equityOffered || "",
  //       minimumInvestment: round.minimumInvestment || "",
  //       useOfFunds: round.useOfFunds,
  //       supportingDocuments: round.supportingDocuments || "",
  //       openDate: new Date(round.openDate),
  //       closingDate: new Date(round.closingDate),
  //       companyStage: round.companyStage,
  //       roundStatus: round.roundStatus,
  //       contactPerson: round.contactPerson,
  //     });
  //   }
  // }, [round, form]);

  // Handle form errors
  // useEffect(() => {
  //   if (error) {
  //     toast({
  //       title: "Error",
  //       description: error,
  //       variant: "destructive",
  //     });
  //     actions.clearError();
  //   }
  // }, [error, actions]);

  const isDirty = form.formState.isDirty;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await actions.updateRound(round._id!, values as RoundFormData);
      toast({
        title: "Round updated",
        description: "The funding round has been successfully updated.",
      });
      router.push(`/round/${round._id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update round",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    if (isDirty) {
      setShowUnsavedChangesDialog(true);
    } else {
      router.push(`/round/${round._id}`);
    }
  }

  async function handleDelete() {
    try {
      await actions.deleteRound(round._id!);
      toast({
        title: "Round deleted",
        description: "The funding round has been permanently deleted.",
        variant: "destructive",
      });
      router.push("/rounds");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete round",
        variant: "destructive",
      });
    }
  }

  // if (loading && !round) {
  //   return (
  //     <div className="container max-w-3xl py-8 flex justify-center">
  //       <p>Loading round data...</p>
  //     </div>
  //   );
  // }

  // if (!loading && !round && !error) {
  //   return (
  //     <div className="container max-w-3xl py-8">
  //       <Card>
  //         <CardContent className="pt-6">
  //           <p>
  //             Round not found. The round may have been deleted or you don't have
  //             permission to view it.
  //           </p>
  //           <Button className="mt-4" onClick={() => router.push("/rounds")}>
  //             Back to Rounds
  //           </Button>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }

  return (
    <div className=" p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Edit Funding Round</h1>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-muted-foreground text-sm">ID: {round._id}</p>
            {round && (
              <Badge className={getStatusColor(round.roundStatus)}>
                {round.roundStatus}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-red-500 border-red-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Round
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
        </div>
      </div>

      {/* Metadata */}
      {round && (
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row justify-between text-sm text-muted-foreground">
              <div>
                Created: {format(new Date(round.createdAt!), "PPP 'at' p")}
              </div>
              <div>
                Last modified:{" "}
                {format(new Date(round.updatedAt!), "PPP 'at' p")}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Round Details</CardTitle>
          <CardDescription>
            Update the details of your funding round. Fields marked with an
            asterisk (*) are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              id="edit-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="roundTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Round Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Seed Round – Q3 2025"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a descriptive title for your funding round.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="roundType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Round Type *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select round type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                            <SelectItem value="Seed">Seed</SelectItem>
                            <SelectItem value="Series A">Series A</SelectItem>
                            <SelectItem value="Series B">Series B</SelectItem>
                            <SelectItem value="Bridge / Convertible">
                              Bridge / Convertible
                            </SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="roundStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Round Status *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select round status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Draft">Draft</SelectItem>
                            <SelectItem value="Under Review">
                              Under Review
                            </SelectItem>
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fundingGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funding Goal / Target Amount *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., USD 100,000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="valuation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valuation (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., USD 500,000 pre-money"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="equityOffered"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equity Offered (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 10% equity" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minimumInvestment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Minimum Investment per Investor (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., USD 5,000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="useOfFunds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Use of Funds / Investment Rationale *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what the funds will be used for: product development, hiring, scaling, etc."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supportingDocuments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Pitch Deck or Supporting Documents (Optional)
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="PDF, Google Drive link, etc."
                            {...field}
                            className="flex-1"
                          />
                          <Button type="button" variant="outline" size="icon">
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Provide a link to your pitch deck or supporting
                        documents.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="openDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Open Date *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Date the round begins accepting investments.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="closingDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Closing Date *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Date the round closes.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="companyStage"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Company Stage *</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Idea" />
                            </FormControl>
                            <FormLabel className="font-normal">Idea</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="MVP" />
                            </FormControl>
                            <FormLabel className="font-normal">MVP</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Revenue" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Revenue
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Scaling" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Scaling
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        For investor communication after approval (auto-filled
                        from company profile).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" form="edit-form" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>

      {/* Unsaved Changes Dialog */}
      <AlertDialog
        open={showUnsavedChangesDialog}
        onOpenChange={setShowUnsavedChangesDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave this
              page? Your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowUnsavedChangesDialog(false);
                router.push(`/round/${round._id}`);
              }}
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
