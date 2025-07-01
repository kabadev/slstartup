"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, Upload } from "lucide-react";
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
import { toast } from "@/components/ui/use-toast";
// import { useRounds } from "@/context/rounds-context";
import { useRounds } from "@/contexts/rounds-context";
import type { RoundFormData } from "@/types/types.ts";
import { useUser } from "@clerk/nextjs";
import { createRound } from "@/app/actions/round-actions";

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

export default function FundingRoundForm() {
  const { user } = useUser(); // Assuming you have a user context or hook to get the current user
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roundTitle: "",
      fundingGoal: "",
      valuation: "",
      equityOffered: "",
      minimumInvestment: "",
      useOfFunds: "",
      supportingDocuments: "",
      contactPerson: "Lans Kabba", // Auto-filled example
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const round = await createRound({
        ...values,
        userId: user?.id,
        companyId: user?.publicMetadata.companyId,
      } as RoundFormData);
      router.push(`/round/${round._id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create round",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full p-6 shadow-none border-none">
      <CardHeader>
        <CardTitle>Funding Round Details</CardTitle>

        <CardDescription>
          Enter the details of your funding round. Fields marked with an
          asterisk (*) are required.
        </CardDescription>
      </CardHeader>
      <CardContent className="border rounded-md p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <FormLabel>Use of Funds / Investment Rationale *</FormLabel>
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
                      Provide a link to your pitch deck or supporting documents.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                      <FormDescription>Date the round closes.</FormDescription>
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
                          <FormLabel className="font-normal">Revenue</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Scaling" />
                          </FormControl>
                          <FormLabel className="font-normal">Scaling</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
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

            <CardFooter className="flex justify-between px-0">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/rounds")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Funding Round"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
