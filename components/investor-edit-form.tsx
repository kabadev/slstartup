"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Trash2, Plus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { updateInvestorAction } from "@/app/actions/investor-actions";
import { getCachedFilterOptions } from "@/lib/db-simulation";
import type { Investor } from "@/lib/db-simulation";

// Define the form schema with zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  type: z.string().optional(),
  location: z.string().optional(),
  foundedAt: z.string().optional(),
  logo: z.string().optional(),
  registrationNumber: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().optional(),
  stage: z.string().optional(),
  description: z.string().optional(),
  fundingCapacity: z.string().optional(),
  amountRaised: z.coerce.number().optional(),
  goalExpected: z.string().optional(),
  profileDocuments: z.string().optional(),
  businessRegistrationDocuments: z.string().optional(),
  // We'll handle sectorInterested and socialLinks separately
});

interface InvestorEditFormProps {
  investor: Investor;
}

export default function InvestorEditForm({ investor }: any) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sectors, setSectors] = useState<string[]>(
    investor.sectorInterested || []
  );
  const [socialLinks, setSocialLinks] = useState<
    { name: string; link: string }[]
  >(investor.socialLinks || []);
  const [newSector, setNewSector] = useState("");
  const [newSocialName, setNewSocialName] = useState("");
  const [newSocialLink, setNewSocialLink] = useState("");
  const [filterOptions, setFilterOptions] = useState<{
    sectors: string[];
    stages: string[];
    investorTypes: string[];
  }>({
    sectors: [],
    stages: [],
    investorTypes: [],
  });

  // Fetch filter options
  useState(() => {
    const fetchOptions = async () => {
      try {
        const options = await getCachedFilterOptions();
        setFilterOptions(options);
      } catch (error) {
        console.error("Failed to fetch filter options:", error);
      }
    };
    fetchOptions();
  });

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: investor.name,
      type: investor.type || "",
      location: investor.location || "",
      foundedAt: investor.foundedAt || "",
      logo: investor.logo || "",
      registrationNumber: investor.registrationNumber || "",
      email: investor.email || "",
      phone: investor.phone || "",
      address: investor.address || "",
      website: investor.website || "",
      stage: investor.stage || "",
      description: investor.description || "",
      fundingCapacity: investor.fundingCapacity || "",
      amountRaised: investor.amountRaised,
      goalExpected: investor.goalExpected || "",
      profileDocuments: investor.profileDocuments || "",
      businessRegistrationDocuments:
        investor.businessRegistrationDocuments || "",
    },
  });

  // Add a sector
  const handleAddSector = () => {
    if (newSector && !sectors.includes(newSector)) {
      setSectors([...sectors, newSector]);
      setNewSector("");
    }
  };

  // Remove a sector
  const handleRemoveSector = (sector: string) => {
    setSectors(sectors.filter((s) => s !== sector));
  };

  // Add a social link
  const handleAddSocialLink = () => {
    if (newSocialName && newSocialLink) {
      setSocialLinks([
        ...socialLinks,
        { name: newSocialName, link: newSocialLink },
      ]);
      setNewSocialName("");
      setNewSocialLink("");
    }
  };

  // Remove a social link
  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      // Combine form values with sectors and social links
      const updatedInvestor = {
        ...values,
        sectorInterested: sectors,
        socialLinks: socialLinks,
      };

      await updateInvestorAction(investor._id, updatedInvestor);

      router.push(`/investors/${investor._id}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating investor:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="investment">Investment</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Investor name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Investor Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select investor type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filterOptions.investorTypes.length > 0 ? (
                              filterOptions.investorTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))
                            ) : (
                              <>
                                <SelectItem value="Venture Capital">
                                  Venture Capital
                                </SelectItem>
                                <SelectItem value="Angel Investor">
                                  Angel Investor
                                </SelectItem>
                                <SelectItem value="Private Equity">
                                  Private Equity
                                </SelectItem>
                                <SelectItem value="Corporate Investor">
                                  Corporate Investor
                                </SelectItem>
                                <SelectItem value="Family Office">
                                  Family Office
                                </SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="City, Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="foundedAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Founded</FormLabel>
                        <FormControl>
                          <Input placeholder="Year founded" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* <FormField
                    control={form.control}
                    name="registrationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Business registration number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                </div>

                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/ilogo.png"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter a URL to your company logo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the investor profile"
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Sectors of Interest */}
                <div className="space-y-2">
                  <FormLabel>Sectors of Interest</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {sectors.map((sector, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {sector}
                        <button
                          type="button"
                          onClick={() => handleRemoveSector(sector)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-3 h-3" />
                          <span className="sr-only">Remove {sector}</span>
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newSector}
                      onChange={(e) => setNewSector(e.target.value)}
                      placeholder="Add a sector"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddSector}
                      disabled={!newSector}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="contact@example.com" {...field} />
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
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Full address"
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Social Links */}
                <div className="space-y-2">
                  <FormLabel>Social Links</FormLabel>
                  {socialLinks.length > 0 && (
                    <div className="mb-2 space-y-2">
                      {socialLinks.map((social, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="grid flex-1 grid-cols-2 gap-2">
                            <Input
                              value={social.name}
                              disabled
                              className="bg-muted"
                            />
                            <Input
                              value={social.link}
                              disabled
                              className="bg-muted"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveSocialLink(index)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                            <span className="sr-only">Remove social link</span>
                          </Button>
                        </div>
                      ))}
                      <Separator className="my-4" />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={newSocialName}
                      onChange={(e) => setNewSocialName(e.target.value)}
                      placeholder="Platform (e.g., LinkedIn)"
                    />
                    <Input
                      value={newSocialLink}
                      onChange={(e) => setNewSocialLink(e.target.value)}
                      placeholder="URL"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddSocialLink}
                    disabled={!newSocialName || !newSocialLink}
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Social Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Investment Tab */}
          <TabsContent value="investment">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="stage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Investment Stage</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filterOptions.stages.length > 0 ? (
                            filterOptions.stages.map((stage) => (
                              <SelectItem key={stage} value={stage}>
                                {stage}
                              </SelectItem>
                            ))
                          ) : (
                            <>
                              <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                              <SelectItem value="Seed">Seed</SelectItem>
                              <SelectItem value="Series A">Series A</SelectItem>
                              <SelectItem value="Series B">Series B</SelectItem>
                              <SelectItem value="Series C">Series C</SelectItem>
                              <SelectItem value="Growth">Growth</SelectItem>
                              <SelectItem value="Late Stage">
                                Late Stage
                              </SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fundingCapacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funding Capacity</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., $1M - $5M" {...field} />
                        </FormControl>
                        <FormDescription>
                          Range or maximum investment amount
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amountRaised"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount Raised</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Total amount raised in USD"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="goalExpected"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investment Goals</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe investment goals and expectations"
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="profileDocuments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Investor Profile PDF</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // You can handle the file upload logic here
                              // For now, we'll store the file name
                              field.onChange(file.name);
                            }
                          }}
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                        />
                      </FormControl>
                      <FormDescription>
                        Upload investor profile documents or brochure (PDF only)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <CardFooter className="flex justify-between px-0 mt-6">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
