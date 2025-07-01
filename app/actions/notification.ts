"use server";

import { connect } from "@/lib/mongoDB";
import Notification from "@/models/Notifcation";

// {from:string,to:string, title:string, desc:string,url:string, isRead?:boolean}
export const sendNotification = async (notificationData: any) => {
  try {
    await connect();
    const newNotification = new Notification(notificationData);
    await newNotification.save();
  } catch (error) {
    console.log(error);
  }
};

export const getUsernotification = async (userId: any) => {
  try {
    await connect();
    const notifications = await Notification.find({ to: userId });
    console.log(notifications);
    return JSON.parse(
      JSON.stringify({ success: true, notifications: notifications })
    );
  } catch (error) {
    console.log(error);
  }
};

export const MarkAsread = async (notificationId: any) => {
  try {
    await connect();
    await Notification.findByIdAndDelete(notificationId);
    // await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    return JSON.parse(
      JSON.stringify({ success: true, message: "mark as read" })
    );
  } catch (error) {
    console.log(error);
  }
};
