"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { HelpCircle, Info, Router, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { timeframes, investmentRanges, investorTypes } from "@/data";

import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";
import { getInvestorByIdAction } from "@/app/actions/investor-actions";
import { useRouter, useSearchParams } from "next/navigation";
import { createInterest } from "@/app/actions/investor-interest-action";

const investmentGoals = [
  { id: "growth", label: "Growth & Expansion" },
  { id: "income", label: "Regular Income" },
  { id: "strategic", label: "Strategic Partnership" },
  { id: "acquisition", label: "Potential Acquisition" },
  { id: "diversification", label: "Portfolio Diversification" },
];

const formSchema = z.object({
  // Personal Information
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  company: z.string().optional(),

  // Investor Profile
  investorType: z.string({ required_error: "Please select an investor type." }),
  investmentExperience: z.enum(
    ["none", "beginner", "intermediate", "experienced"],
    {
      required_error: "Please select your investment experience.",
    }
  ),

  // Investment Details
  investmentRange: z.string({
    required_error: "Please select an investment range.",
  }),
  timeframe: z.string({ required_error: "Please select a timeframe." }),
  investmentGoals: z
    .array(z.string())
    .min(1, { message: "Please select at least one investment goal." }),

  // Additional Information
  investmentThesis: z
    .string()
    .min(10, { message: "Investment thesis must be at least 10 characters." })
    .max(1000, {
      message: "Investment thesis must not exceed 1000 characters.",
    }),
  questions: z.string().optional(),

  // Previous Investments
  hasPreviousInvestments: z.boolean(),
  previousInvestments: z.string().optional(),

  // Terms
  termsAgreed: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
  contactPreference: z.enum(["email", "phone", "both"], {
    required_error: "Please select your contact preference.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function InvestorInterestForm({ investor, round }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  // const [investorData, setInvestorData] = useState({});

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: investor?.name || "",
      email: investor?.email || "",
      phone: investor?.phone || "",
      company: investor?.name || "",
      investorType: "",
      investmentExperience: "none",
      investmentRange: "",
      timeframe: "",
      investmentGoals: [],
      investmentThesis: "",
      questions: "",
      hasPreviousInvestments: false,
      previousInvestments: "",
      termsAgreed: false,
      contactPreference: "email",
    },
  });

  const watchHasPreviousInvestments = form.watch("hasPreviousInvestments");

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    try {
      const data = {
        ...values,
        companyId: round.companyId,
        userId: investor.userId,
        investorId: investor._id,
        roundId: round._id,
        companyUserId: round.userId,
      };
      const interestres = await createInterest(data);
      if (interestres.success) {
        alert("Successfully .");
        router.push(`/investor-interest/interest/${interestres.interestId}`);
        form.reset();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting your interest. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Express Investment Interest</CardTitle>
        <CardDescription>
          Complete this form to express your interest in investing in{" "}
          {investor?.name || "this company"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information Section */}
            <div>
              <h3 className="mb-4 text-lg font-medium">Personal Information</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john.doe@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormDescription>
                        Optional, but recommended for follow-up
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company/Firm</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Ventures" {...field} />
                      </FormControl>
                      <FormDescription>
                        If you're representing an organization
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Investor Profile Section */}
            <div>
              <h3 className="mb-4 text-lg font-medium">Investor Profile</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="investorType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investor Type *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select investor type" />
                          </SelectTrigger>
                        </FormControl>
                        {/* <SelectContent>
                          {investorTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent> */}

                        <SelectContent>
                          {investorTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="investmentExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investment Experience *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">
                            No Prior Experience
                          </SelectItem>
                          <SelectItem value="beginner">
                            Beginner (1-2 investments)
                          </SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate (3-10 investments)
                          </SelectItem>
                          <SelectItem value="experienced">
                            Experienced (10+ investments)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Investment Details Section */}
            <div>
              <h3 className="mb-4 text-lg font-medium">Investment Details</h3>
              <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="investmentRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Investment Range *
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="w-4 h-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>The amount you're considering investing</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {investmentRanges.map((range) => (
                            <SelectItem key={range} value={range}>
                              {range}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeframe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investment Timeframe *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeframe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeframes.map((timeframe) => (
                            <SelectItem key={timeframe} value={timeframe}>
                              {timeframe}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="investmentGoals"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Investment Goals *</FormLabel>
                      <FormDescription>
                        Select all that apply to your investment strategy
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {investmentGoals.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="investmentGoals"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            item.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Additional Information Section */}
            <div>
              <h3 className="mb-4 text-lg font-medium">
                Additional Information
              </h3>

              <FormField
                control={form.control}
                name="investmentThesis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investment Thesis *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Explain why you're interested in investing in this company and what you see as the potential..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Briefly describe your investment thesis and what interests
                      you about this company.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="hasPreviousInvestments"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I have previous investments in similar
                          companies/sectors
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {watchHasPreviousInvestments && (
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="previousInvestments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Previous Investments</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please briefly describe your previous investments in similar companies or sectors..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="questions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Questions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any specific questions you have for the company..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Any specific questions you'd like answered before
                        proceeding.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Contact Preferences */}
            <div>
              <h3 className="mb-4 text-lg font-medium">Contact Preferences</h3>

              <FormField
                control={form.control}
                name="contactPreference"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Preferred Contact Method *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="email" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Email Only
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="phone" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Phone Only
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="both" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Both Email and Phone
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Terms and Conditions */}
            <FormField
              control={form.control}
              name="termsAgreed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>I agree to the terms and conditions *</FormLabel>
                    <FormDescription>
                      By submitting this form, you agree that the company may
                      contact you regarding your investment interest. Your
                      information will be kept confidential and only shared with
                      relevant team members.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-current rounded-full animate-spin border-t-transparent" />
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Submit Interest
                </span>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-col pt-6 space-y-4 border-t">
        <div className="flex items-center text-sm text-muted-foreground">
          <Info className="w-4 h-4 mr-2" />
          Your information will be shared only with the company. See our privacy
          policy for details.
        </div>
      </CardFooter>
    </Card>
  );
}
