"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { getUsernotification, MarkAsread } from "@/app/actions/notification";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { url } from "inspector";
const NotificationBell = () => {
  const { user } = useUser();
  const router = useRouter();

  const [notifications, setNotifications] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);

  const getnotification = async () => {
    const res = await getUsernotification(user?.id);
    setNotifications(res.notifications);

    const unreadCount = res.notifications.filter(
      (notification: any) => !notification.isRead
    ).length;

    setNotificationsCount(unreadCount);
  };

  useEffect(() => {
    getnotification();
  }, [user]);

  const handleOpenAndMarkRead = async (notification: any) => {
    try {
      await MarkAsread(notification._id);
      router.push(notification.url);
      getnotification();
    } catch (error) {
      console.log("error");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative h-full p-0 w-20 flex items-center justify-center">
        <Bell className="w-20" size={50} />
        <div className=" absolute w-6 h-6 text-white bg-red-500 rounded-full  -mt-6 ml-2 z-10 flex justify-center items-start">
          <span className=" text-[12px] text-center">{notificationsCount}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="h-[400px] w-[300px] overflow-y-auto">
        <DropdownMenuLabel>Notification</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length < 1 ? (
          <div className="h-[200px] flex justify-center items-center">
            <h2 className="text-muted-foreground">No Notification found</h2>
          </div>
        ) : (
          notifications.map((notification: any, i) => {
            if (!notification?.isRead) {
              return (
                <DropdownMenuItem
                  key={i}
                  onClick={() => handleOpenAndMarkRead(notification)}
                  className="flex-col  items-start cursor-pointer "
                >
                  <h2 className="font-bold">{notification.title}</h2>
                  <p className="text-xs">{notification.desc}</p>
                  <span className=" text-xs">{notification.createdAt}</span>
                </DropdownMenuItem>
              );
            } else {
              return (
                <DropdownMenuItem
                  key={i}
                  onClick={() => handleOpenAndMarkRead(notification)}
                  className="flex-col items-start cursor-pointer bg-accent"
                >
                  <h2 className="">{notification.title}</h2>
                  <p className="text-xs">{notification.desc}</p>
                  <span className=" text-xs">{notification.createdAt}</span>
                </DropdownMenuItem>
              );
            }
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
