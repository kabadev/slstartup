"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ExternalLink,
  Search,
  Globe,
  Lightbulb,
  Users,
  BookOpen,
  Calendar,
  MessageSquare,
  Briefcase,
  GraduationCap,
  Newspaper,
  Video,
} from "lucide-react";

export default function OtherPlatforms() {
  const platforms = [
    {
      id: 1,
      name: "Innovation Salone Hub",
      description:
        "Central hub for innovation and entrepreneurship in Sierra Leone",
      url: "https://innovationsalone.com",
      category: "Innovation",
      icon: <Lightbulb className="w-6 h-6" />,
      status: "Active",
      features: ["Startup Incubation", "Mentorship", "Funding Support"],
    },
    {
      id: 2,
      name: "TechSL Community",
      description: "Community platform for tech professionals and enthusiasts",
      url: "https://techsl.community",
      category: "Community",
      icon: <Users className="w-6 h-6" />,
      status: "Active",
      features: ["Networking", "Events", "Job Board"],
    },
    {
      id: 3,
      name: "SL Learning Hub",
      description: "Educational platform for skill development and training",
      url: "https://learning.innovationsalone.com",
      category: "Education",
      icon: <BookOpen className="w-6 h-6" />,
      status: "Active",
      features: ["Online Courses", "Certifications", "Workshops"],
    },
    {
      id: 4,
      name: "Events SL",
      description:
        "Comprehensive events platform for the Sierra Leone tech ecosystem",
      url: "https://events.innovationsalone.com",
      category: "Events",
      icon: <Calendar className="w-6 h-6" />,
      status: "Active",
      features: ["Event Listings", "Registration", "Networking"],
    },
    {
      id: 5,
      name: "SL Forum",
      description: "Discussion forum for entrepreneurs and innovators",
      url: "https://forum.innovationsalone.com",
      category: "Community",
      icon: <MessageSquare className="w-6 h-6" />,
      status: "Active",
      features: ["Discussions", "Q&A", "Knowledge Sharing"],
    },
    {
      id: 6,
      name: "Jobs SL",
      description:
        "Job board connecting talent with opportunities in Sierra Leone",
      url: "https://jobs.innovationsalone.com",
      category: "Jobs",
      icon: <Briefcase className="w-6 h-6" />,
      status: "Active",
      features: ["Job Listings", "Talent Pool", "Career Resources"],
    },
    {
      id: 8,
      name: "Inno Digital",
      description:
        "Latest news and insights from Sierra Leone's innovation ecosystem",
      url: "https://news.innovationsalone.com",
      category: "News",
      icon: <Newspaper className="w-6 h-6" />,
      status: "Active",
      features: ["News Articles", "Industry Reports", "Interviews"],
    },
    {
      id: 9,
      name: "Salone Crowdfunder",
      description: "Crowdfunding platform for startups and projects",
      url: "https://crowdfunder.innovationsalone.com",
      category: "Events",
      icon: <Video className="w-6 h-6" />,
      status: "Active",
      features: ["Live Webinars", "Recordings", "Interactive Sessions"],
    },
  ];

  const categories = ["Other platforms"];

  return (
    <div className="min-h-scree">
      {/* Header */}
      <div className="border-b ">
        <div className="px-6 py-8">
          <div className="max-w-4xl">
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              Other Platforms
            </h1>
            <p className="mb-6 text-lg text-gray-600 dark:text-white">
              Explore Innovation Salone's ecosystem of platforms and services
              designed to support entrepreneurs, innovators, and the tech
              community in Sierra Leone.
            </p>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <Input placeholder="Search platforms..." className="pl-10" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Platforms Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {platforms.map((platform) => (
            <Card
              key={platform.id}
              className="transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 text-blue-600 bg-blue-100 rounded-lg">
                      {platform.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{platform.name}</CardTitle>
                      <div className="flex items-center mt-1 space-x-2">
                        <Badge
                          variant={
                            platform.status === "Active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {platform.status}
                        </Badge>
                        <Badge variant="outline">{platform.category}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-3">
                  {platform.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Key Features:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {platform.features.map((feature, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Globe className="w-4 h-4 mr-1" />
                      <span className="truncate">{platform.url}</span>
                    </div>
                    <Button
                      size="sm"
                      disabled={platform.status === "Coming Soon"}
                      asChild={platform.status === "Active"}
                    >
                      {platform.status === "Active" ? (
                        <a
                          href={platform.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visit
                        </a>
                      ) : (
                        <>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Coming Soon
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Join the Innovation Salone Ecosystem</CardTitle>
              <CardDescription>
                Connect with our growing network of platforms and services
                designed to accelerate innovation and entrepreneurship in Sierra
                Leone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button>
                  <Users className="w-4 h-4 mr-2" />
                  Join Community
                </Button>
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Get Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
