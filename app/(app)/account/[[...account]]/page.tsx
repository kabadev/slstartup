import { UserProfile } from "@clerk/nextjs";
import React from "react";

const page = () => {
  return (
    <div className="w-full z-40">
      <UserProfile />
    </div>
  );
};

export default page;
