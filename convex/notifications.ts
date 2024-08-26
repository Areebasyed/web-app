// convex/notifications.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getNotifications = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("sendTo"), args.userId))
      .order("desc")
      .collect();

    return notifications;
  },
});


export const markNotificationsAsRead = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const { userId } = args;

    // Find all unread notifications for this user
    const unreadNotifications = await ctx.db
      .query("notifications")
      .filter((q) => 
        q.and(
          q.eq(q.field("sendTo"), userId),
          q.eq(q.field("isRead"), false)
        )
      )
      .collect();

    // Update each notification to mark it as read
    for (const notification of unreadNotifications) {
      await ctx.db.patch(notification._id, { isRead: true });
    }

    return { success: true, count: unreadNotifications.length };
  },
});