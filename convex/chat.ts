

import { ConvexError, v } from "convex/values";
import {  mutation, query } from "./_generated/server";

export const createChat = mutation({
    args: {
        gigId: v.id("sellerGigs"),
        sellerId: v.id("users"),
        buyerId: v.id("users")
    },
    handler: async (ctx, args) => {
        
        const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError("Unauthorized");
		}

		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
			.unique();

		if (!user || user.Asseller) {
			throw new ConvexError("only buyer can create chat");
		}
         
        await ctx.db.insert("chat", {
            gigId: args.gigId,
            sellerId: args.sellerId,
            buyerId: args.buyerId
        })   
    },
})


export const getChatByGigId = query({
    args: { gigId: v.id("sellerGigs") },
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
      // Remove the check for seller status
      return ctx.db
        .query("chat")
        .withIndex("by_gigId", (q) => q.eq("gigId", args.gigId)).first();
        
    },
  });

export const sendMessage = mutation({
    args: {
        chatId: v.id("chat"),
        content: v.string(),
        userId: v.id("users")
    },


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
         await ctx.db.insert("message", {
            chatId: args.chatId,
            content: args.content,
            userId: args.userId,
            isRead: false
        
        })

        await ctx.db.insert("notifications", {
          notificationType: "message",
          content: args.content,
          sendBy: user._id,
          sendTo: args.userId,
          isRead: false
          
        })
    }
})  