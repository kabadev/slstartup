"use client";

import Image from "next/image";
import { Building2, Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const team = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Executive Director",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Sarah has over 15 years of experience in entrepreneurship and ecosystem building.",
  },
  {
    id: 2,
    name: "Michael Kamara",
    role: "Head of Programs",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Michael leads our startup support programs and mentorship initiatives.",
  },
  {
    id: 3,
    name: "Aminata Sesay",
    role: "Investor Relations",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Aminata connects startups with investors and manages funding relationships.",
  },
  {
    id: 4,
    name: "David Cole",
    role: "Technology Lead",
    image: "/placeholder.svg?height=300&width=300",
    bio: "David oversees our technology infrastructure and digital initiatives.",
  },
];

export function AboutPage() {
  return (
    <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">About StartUpSL</h1>
        <p className="text-muted-foreground">
          Learn about our mission and team
        </p>
      </div>

      <Tabs defaultValue="mission" className="w-full">
        <TabsList>
          <TabsTrigger value="mission">Our Mission</TabsTrigger>
          <TabsTrigger value="team">Our Team</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
        </TabsList>
        <TabsContent value="mission" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>
                Building Sierra Leone's startup ecosystem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                <Image
                  src="/images/placeholder1.jpg?height=720&width=1280"
                  alt="StartUpSL team"
                  width={1280}
                  height={720}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-4">
                <p>
                  StartUpSL is an ecosystem for all to share resources,
                  collaborate and support. We encourage startups and other
                  established companies to register with us to access resources,
                  networking opportunities, and support services that can help
                  accelerate their growth.
                </p>
                <p>
                  Our mission is to foster innovation, entrepreneurship, and
                  economic growth in Sierra Leone by providing a comprehensive
                  platform that connects startups, investors, and resources. We
                  believe that by building a strong startup ecosystem, we can
                  create jobs, drive innovation, and contribute to the
                  sustainable development of Sierra Leone.
                </p>
                <h3 className="text-xl font-semibold">Our Goals</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Support entrepreneurs in building successful, scalable
                    businesses
                  </li>
                  <li>
                    Connect startups with investors and funding opportunities
                  </li>
                  <li>
                    Provide resources, mentorship, and training for startup
                    growth
                  </li>
                  <li>
                    Foster collaboration between startups, established
                    companies, and government
                  </li>
                  <li>
                    Showcase Sierra Leone's innovation and entrepreneurial
                    talent
                  </li>
                  <li>Attract international investment and partnerships</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="team" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square overflow-hidden">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={300}
                      height={300}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {member.role}
                    </p>
                    <p className="mt-2 text-sm">{member.bio}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="partners" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Our Partners</CardTitle>
              <CardDescription>
                Organizations that support our mission
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-md bg-muted">
                    <Building2 className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="mt-2 text-center font-medium">
                    Ministry of Innovation
                  </h3>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-md bg-muted">
                    <Building2 className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="mt-2 text-center font-medium">
                    Global Ventures
                  </h3>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-md bg-muted">
                    <Building2 className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="mt-2 text-center font-medium">
                    Tech Foundation
                  </h3>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-md bg-muted">
                    <Building2 className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="mt-2 text-center font-medium">
                    Innovation Hub
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="contact" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>Get in touch with our team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-sm text-muted-foreground">
                        123 Innovation Street
                        <br />
                        Freetown, Sierra Leone
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-sm text-muted-foreground">
                        info@startupsl.org
                        <br />
                        support@startupsl.org
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-sm text-muted-foreground">
                        +232 76 123 4567
                        <br />
                        +232 77 987 6543
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <input
                      id="name"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      id="message"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Your message"
                      rows={4}
                    />
                  </div>
                  <Button className="w-full">Send Message</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
