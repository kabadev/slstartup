import { currentUser } from "@clerk/nextjs/server";

const user: any = currentUser();

type Role = "admin" | "company" | "investor";
type Action = "view" | "add" | "edit" | "delete";

interface Resource {
  type: string;
  userId: string;
}

interface User {
  id: string;
  publicMetadata: {
    role: Role;
  };
}

export function hasPermission(
  user: User,
  action: Action,
  resource?: Resource
): boolean {
  const role = user?.publicMetadata?.role;

  if (role === "admin") return true; // Admin can do everything

  if (role === "company") {
    if (action === "view" || action === "add") return true;

    if (
      (action === "edit" || action === "delete") &&
      resource?.type === "company"
    ) {
      return resource.userId === user.id;
    }
  }

  if (role === "investor") {
    if (action === "view") return true;
  }

  return false; // default deny
}
