"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  followUnfollowCompany,
  isFollow,
} from "@/app/actions/investor-actions";

const FollowButton = ({ userId }: { userId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);

  // Get initial follow state
  useEffect(() => {
    const checkFollowStatus = async () => {
      const followed = await isFollow(userId);
      setIsFollowing(followed);
    };
    checkFollowStatus();
  }, [userId]);

  const handleFollow = async () => {
    try {
      setIsLoading(true);
      const res = await followUnfollowCompany(userId);
      if (res?.success) {
        setIsFollowing((prev) => !prev); // Toggle follow state
      }
    } catch (error) {
      console.error("Follow/unfollow error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // While checking follow status
  if (isFollowing === null) {
    return (
      <Button disabled size="sm" className="flex-1 md:flex-none">
        Loading...
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      onClick={handleFollow}
      className="flex-1 md:flex-none"
      disabled={isLoading}
    >
      {isLoading
        ? isFollowing
          ? "Unfollowing..."
          : "Following..."
        : isFollowing
        ? "Unfollow"
        : "Follow"}
    </Button>
  );
};

export default FollowButton;
