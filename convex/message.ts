

import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";



   export const getAllMessagesPerChat = query({
    args: { chatId: v.id("chat") },
    handler: async (ctx, args) => {

        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
          return null; // Instead of throwing an error, return null for unauthenticated users
        }
        const user = await ctx.db
          .query("users")
          .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
          .unique();
        if (!user) {
          return null; // Return null if user not found
        }
      return await ctx.db
        .query("message")
        .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
        
        .collect();
    },
  });