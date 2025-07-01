// "use client";

// import { Calendar, Filter, MapPin, Plus, Search, Users } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";

// const events = [
//   {
//     id: 1,
//     title: "Startup Pitch Night",
//     description:
//       "Join us for an evening of innovative startup pitches and networking",
//     date: "May 15, 2024",
//     time: "6:00 PM - 9:00 PM",
//     location: "Innovation Hub, Freetown",
//     type: "In-person",
//     attendees: 75,
//   },
//   {
//     id: 2,
//     title: "Investor Meetup",
//     description: "Connect with active investors in the Sierra Leone ecosystem",
//     date: "May 22, 2024",
//     time: "2:00 PM - 4:00 PM",
//     location: "Virtual",
//     type: "Online",
//     attendees: 120,
//   },
//   {
//     id: 3,
//     title: "Founder Workshop: Fundraising Strategies",
//     description:
//       "Learn effective strategies for raising capital for your startup",
//     date: "June 5, 2024",
//     time: "10:00 AM - 12:00 PM",
//     location: "StartupSL Office, Freetown",
//     type: "In-person",
//     attendees: 40,
//   },
//   {
//     id: 4,
//     title: "Tech Meetup: AI & Machine Learning",
//     description: "Explore the latest trends in AI and machine learning",
//     date: "June 12, 2024",
//     time: "4:00 PM - 6:00 PM",
//     location: "Tech Hub, Bo",
//     type: "In-person",
//     attendees: 55,
//   },
//   {
//     id: 5,
//     title: "Startup Legal Clinic",
//     description:
//       "Get your legal questions answered by experienced startup attorneys",
//     date: "June 18, 2024",
//     time: "1:00 PM - 5:00 PM",
//     location: "StartupSL Office, Freetown",
//     type: "In-person",
//     attendees: 30,
//   },
//   {
//     id: 6,
//     title: "Women in Tech Panel Discussion",
//     description: "Join leading women entrepreneurs for an inspiring discussion",
//     date: "June 25, 2024",
//     time: "3:00 PM - 5:00 PM",
//     location: "Virtual",
//     type: "Online",
//     attendees: 150,
//   },
// ];

// export function EventsPage() {
//   return (
//     <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
//       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Events</h1>
//           <p className="text-muted-foreground">
//             Connect with the startup community
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button>
//             <Plus className="mr-2 h-4 w-4" />
//             Add Event
//           </Button>
//         </div>
//       </div>

//       <Card className="border-0 shadow-none">
//         <CardHeader>
//           <CardTitle>Upcoming Events</CardTitle>
//           <CardDescription>
//             Browse and register for upcoming events
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col gap-4">
//             <div className="flex flex-col gap-4 md:flex-row md:items-center">
//               <div className="relative flex-1">
//                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   type="search"
//                   placeholder="Search events..."
//                   className="pl-9"
//                 />
//               </div>
//               <Button variant="outline" size="sm" className="md:w-auto">
//                 <Filter className="mr-2 h-4 w-4" />
//                 Filters
//               </Button>
//             </div>

//             <Tabs defaultValue="all" className="w-full">
//               <TabsList>
//                 <TabsTrigger value="all">All Events</TabsTrigger>
//                 <TabsTrigger value="in-person">In-person</TabsTrigger>
//                 <TabsTrigger value="online">Online</TabsTrigger>
//               </TabsList>
//               <TabsContent value="all" className="mt-4">
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                   {events.map((event) => (
//                     <Card key={event.id} className="flex flex-col">
//                       <CardHeader className="pb-3">
//                         <div className="flex items-start justify-between">
//                           <div>
//                             <CardTitle className="text-lg">
//                               {event.title}
//                             </CardTitle>
//                             <CardDescription className="mt-1">
//                               {event.description}
//                             </CardDescription>
//                           </div>
//                           <Badge
//                             variant="outline"
//                             className={
//                               event.type === "In-person"
//                                 ? "border-green-500 text-green-500"
//                                 : "border-blue-500 text-blue-500"
//                             }
//                           >
//                             {event.type}
//                           </Badge>
//                         </div>
//                       </CardHeader>
//                       <CardContent className="flex flex-1 flex-col">
//                         <div className="space-y-3 text-sm">
//                           <div className="flex items-center text-muted-foreground">
//                             <Calendar className="mr-2 h-4 w-4" />
//                             {event.date} • {event.time}
//                           </div>
//                           <div className="flex items-center text-muted-foreground">
//                             <MapPin className="mr-2 h-4 w-4" />
//                             {event.location}
//                           </div>
//                           <div className="flex items-center text-muted-foreground">
//                             <Users className="mr-2 h-4 w-4" />
//                             {event.attendees} attendees
//                           </div>
//                         </div>
//                         <div className="mt-auto pt-4">
//                           <Button className="w-full">Register</Button>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               </TabsContent>
//               <TabsContent value="in-person" className="mt-4">
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                   {events
//                     .filter((e) => e.type === "In-person")
//                     .map((event) => (
//                       <Card key={event.id} className="flex flex-col">
//                         <CardHeader className="pb-3">
//                           <div className="flex items-start justify-between">
//                             <div>
//                               <CardTitle className="text-lg">
//                                 {event.title}
//                               </CardTitle>
//                               <CardDescription className="mt-1">
//                                 {event.description}
//                               </CardDescription>
//                             </div>
//                             <Badge
//                               variant="outline"
//                               className="border-green-500 text-green-500"
//                             >
//                               {event.type}
//                             </Badge>
//                           </div>
//                         </CardHeader>
//                         <CardContent className="flex flex-1 flex-col">
//                           <div className="space-y-3 text-sm">
//                             <div className="flex items-center text-muted-foreground">
//                               <Calendar className="mr-2 h-4 w-4" />
//                               {event.date} • {event.time}
//                             </div>
//                             <div className="flex items-center text-muted-foreground">
//                               <MapPin className="mr-2 h-4 w-4" />
//                               {event.location}
//                             </div>
//                             <div className="flex items-center text-muted-foreground">
//                               <Users className="mr-2 h-4 w-4" />
//                               {event.attendees} attendees
//                             </div>
//                           </div>
//                           <div className="mt-auto pt-4">
//                             <Button className="w-full">Register</Button>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                 </div>
//               </TabsContent>
//               <TabsContent value="online" className="mt-4">
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                   {events
//                     .filter((e) => e.type === "Online")
//                     .map((event) => (
//                       <Card key={event.id} className="flex flex-col">
//                         <CardHeader className="pb-3">
//                           <div className="flex items-start justify-between">
//                             <div>
//                               <CardTitle className="text-lg">
//                                 {event.title}
//                               </CardTitle>
//                               <CardDescription className="mt-1">
//                                 {event.description}
//                               </CardDescription>
//                             </div>
//                             <Badge
//                               variant="outline"
//                               className="border-blue-500 text-blue-500"
//                             >
//                               {event.type}
//                             </Badge>
//                           </div>
//                         </CardHeader>
//                         <CardContent className="flex flex-1 flex-col">
//                           <div className="space-y-3 text-sm">
//                             <div className="flex items-center text-muted-foreground">
//                               <Calendar className="mr-2 h-4 w-4" />
//                               {event.date} • {event.time}
//                             </div>
//                             <div className="flex items-center text-muted-foreground">
//                               <MapPin className="mr-2 h-4 w-4" />
//                               {event.location}
//                             </div>
//                             <div className="flex items-center text-muted-foreground">
//                               <Users className="mr-2 h-4 w-4" />
//                               {event.attendees} attendees
//                             </div>
//                           </div>
//                           <div className="mt-auto pt-4">
//                             <Button className="w-full">Register</Button>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, Clock, MapPin, Users } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  type: z.enum(["In-person", "Virtual", "Hybrid"]),
  date: z.date({
    required_error: "Please select a date.",
  }),
  time: z.string().min(1, {
    message: "Please enter a valid time.",
  }),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters.",
  }),
  attendees: z.coerce.number().min(1, {
    message: "At least 1 attendee is required.",
  }),
});

export default function EventsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "In-person",
      time: "",
      location: "",
      attendees: 10,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      // Here you would typically send the data to your API
      console.log(values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to events page after successful submission
      router.push("/events");
      router.refresh();
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Event</CardTitle>
          <CardDescription>
            Fill out the form below to create a new event for your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Annual Conference 2025" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of your event as it will appear to attendees.
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
                    <FormLabel>Event Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Join us for our annual conference featuring industry experts and networking opportunities."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A brief description of your event.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="In-person">In-person</SelectItem>
                          <SelectItem value="Virtual">Virtual</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The format of your event.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="attendees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Attendees</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Input type="number" min={1} {...field} />
                          <Users className="ml-2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormDescription>
                        The maximum number of people who can attend.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Event Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
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
                        The date when your event will take place.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Time</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Input placeholder="6:00 PM - 9:00 PM" {...field} />
                          <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormDescription>
                        The time when your event will take place.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Location</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input
                          placeholder="Convention Center, 123 Main St, City"
                          {...field}
                        />
                        <MapPin className="ml-2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormDescription>
                      The address or virtual link for your event.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Submit Event"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
