"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// Define the Event type
export type Event = {
  id: string;
  title: string;
  description: string;
  type: "In-person" | "Virtual" | "Hybrid";
  date: string;
  time: string;
  location: string;
  attendees: number;
  image?: string;
  organizer?: string;
};

// Zod schema for event form validation
const eventSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  location: z
    .string()
    .min(3, { message: "Location must be at least 3 characters." }),
  startDateTime: z.string(),
  endDateTime: z.string(),
  imageUrl: z.string(),
  category: z.string(),
  attendeesLimit: z.number(),
});

// In-memory storage for events (replace with a database in production)
const events: any = [
  {
    id: "1",
    title: "Annual Tech Conference",
    description:
      "Join us for our annual tech conference featuring speakers from around the world discussing the latest in technology trends and innovations.",
    type: "In-person",
    date: "2025-06-15",
    time: "09:00 - 18:00",
    location: "Tech Convention Center, San Francisco",
    attendees: 250,
    image: "/placeholder.svg?height=400&width=800",
    organizer: "Tech Events Inc.",
  },
  {
    id: "2",
    title: "Virtual Product Launch",
    description:
      "Be the first to see our new product lineup and exclusive demos. Our virtual product launch will showcase the latest innovations and features.",
    type: "Virtual",
    date: "2025-07-20",
    time: "14:00 - 16:00",
    location: "Online (Zoom)",
    attendees: 500,
    image: "/placeholder.svg?height=400&width=800",
    organizer: "InnovateTech",
  },
  {
    id: "3",
    title: "Networking Mixer",
    description:
      "Connect with professionals in your industry in a casual setting. Enjoy refreshments while building valuable relationships.",
    type: "In-person",
    date: "2025-08-10",
    time: "18:00 - 21:00",
    location: "Downtown Lounge, New York",
    attendees: 75,
    image: "/placeholder.svg?height=400&width=800",
    organizer: "Professional Network Group",
  },
];

// Function to simulate a delay
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// CRUD Operations
export async function getEvents() {
  try {
    await delay(100); // Simulate network delay
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function getEvent(id: string) {
  try {
    await delay(100); // Simulate network delay
    const event = events.find((event: any) => event.id === id);
    if (!event) {
      throw new Error(`Event with id ${id} not found`);
    }
    return event;
  } catch (error: any) {
    console.error("Error fetching event:", error);
    return undefined;
  }
}

export async function createEvent(prevState: any, formData: FormData) {
  const validatedFields = eventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    location: formData.get("location"),
    startDateTime: formData.get("startDateTime"),
    endDateTime: formData.get("endDateTime"),
    imageUrl: formData.get("imageUrl"),
    category: formData.get("category"),
    attendeesLimit: Number(formData.get("attendeesLimit")),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Event.",
    };
  }

  const {
    title,
    description,
    location,
    startDateTime,
    endDateTime,
    imageUrl,
    category,
    attendeesLimit,
  } = validatedFields.data;
  const id = String(events.length + 1); // Simple ID generation
  const newEvent: any = {
    id,
    title,
    description,
    location,
    startDateTime,
    endDateTime,
    imageUrl,
    category,
    attendeesLimit,
    date: new Date(startDateTime).toLocaleDateString(),
    time: new Date(startDateTime).toLocaleTimeString(),
  };

  try {
    await delay(500); // Simulate database delay
    events.push(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    return { message: "Failed to create event" };
  }

  revalidatePath("/events");
  redirect("/events");
}

export async function updateEvent(
  id: string,
  prevState: any,
  formData: FormData
) {
  const validatedFields = eventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    location: formData.get("location"),
    startDateTime: formData.get("startDateTime"),
    endDateTime: formData.get("endDateTime"),
    imageUrl: formData.get("imageUrl"),
    category: formData.get("category"),
    attendeesLimit: Number(formData.get("attendeesLimit")),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Event.",
    };
  }

  const {
    title,
    description,
    location,
    startDateTime,
    endDateTime,
    imageUrl,
    category,
    attendeesLimit,
  } = validatedFields.data;

  try {
    await delay(500); // Simulate database delay
    const eventIndex = events.findIndex((event: any) => event.id === id);
    if (eventIndex === -1) {
      return { message: `Event with id ${id} not found` };
    }

    events[eventIndex] = {
      id,
      title,
      description,
      location,
      startDateTime,
      endDateTime,
      imageUrl,
      category,
      attendeesLimit,
      date: new Date(startDateTime).toLocaleDateString(),
      time: new Date(startDateTime).toLocaleTimeString(),
    };
  } catch (error) {
    console.error("Error updating event:", error);
    return { message: "Failed to update event" };
  }

  revalidatePath("/events");
  redirect("/events");
}

export async function deleteEvent(id: string) {
  try {
    await delay(500); // Simulate database delay
    const eventIndex = events.findIndex((event: any) => event.id === id);
    if (eventIndex === -1) {
      return { message: `Event with id ${id} not found` };
    }

    events.splice(eventIndex, 1);
  } catch (error) {
    console.error("Error deleting event:", error);
    return { message: "Failed to delete event" };
  }

  revalidatePath("/events");
}

// Event Registration
export async function registerForEvent(eventId: string) {
  try {
    await delay(300); // Simulate processing time
    const eventIndex = events.findIndex((event: any) => event.id === eventId);
    if (eventIndex === -1) {
      throw new Error(`Event with id ${eventId} not found`);
    }

    // Increment the number of attendees
    events[eventIndex] = {
      ...events[eventIndex],
      attendeesLimit: events[eventIndex].attendeesLimit + 1,
    };

    console.log(`User registered for event: ${eventId}`);
    return { success: true, message: "Registration successful" };
  } catch (error: any) {
    console.error("Error registering for event:", error);
    return { success: false, message: error.message || "Registration failed" };
  }
}
