import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


export default defineSchema({
	users: defineTable({
	  email: v.string(),
	  name: v.string(),
	  profileImage: v.string(),
	  isOnline: v.boolean(),
	  tokenIdentifier: v.string(),
	  Asseller: v.optional(v.boolean()),
	})
	  .index("by_email", ["email"])
	  .index("by_tokenIdentifier", ["tokenIdentifier"]),

	  sellerGigs: defineTable({
		userId: v.id("users"),
		title: v.string(),
		description: v.string(),
		serviceType: v.union(v.literal("complete"), v.literal("resources"), v.literal("tools")),
		completeService: v.optional(v.object({
		  teamMembers: v.array(v.string()),
		  resources: v.array(v.object({
			name: v.string(),
			quantity: v.number(),
			unit: v.string(),
			pricePerResource: v.number(),
			imageId: v.optional(v.id("_storage")),
		  })),
		  tools: v.array(v.object({
			name: v.string(),
			quantity: v.number(),
			rentalPricePerTool: v.number(),
			imageId: v.optional(v.id("_storage")),
		  })),
		  packages: v.array(v.object({
			name: v.string(),
			teamSize: v.number(),
			resourceCount: v.number(),
			toolCount: v.number(),
			budget: v.number(),
			deliveryTime: v.number(),
		  })),
		})),
		resourceService: v.optional(v.array(v.object({
		  name: v.string(),
		  quantity: v.number(),
		  unit: v.string(),
		  pricePerResource: v.number(),
		  imageId: v.optional(v.id("_storage")),
		}))),
		toolService: v.optional(v.array(v.object({
		  name: v.string(),
		  quantity: v.number(),
		  rentalPricePerTool: v.number(),
		  imageId: v.optional(v.id("_storage")),
		}))),
		
	  })
		.index("by_userId", ["userId"])
		.index("by_serviceType", ["serviceType"]),

		message: defineTable({
			chatId: v.id("chat"),
			userId: v.id("users"),
			content: v.string(),
			isRead: v.boolean(),
		}).index("by_chatId", ["chatId"]),
		chat: defineTable({
			gigId: v.id("sellerGigs"),
			sellerId: v.id("users"),
			buyerId: v.id("users"),
			messages: v.optional(v.array(v.id("message"))),
		}).index("by_gigId", ["gigId"]),
		notifications: defineTable({
			notificationType: v.union(v.literal("order"), v.literal("message")),
			content: v.string(),
			orderId: v.optional(v.id("orders")),
			sendBy: v.id("users"),
			sendTo: v.id("users"),
			isRead: v.boolean(),
		  })
			.index("by_sendTo", ["sendTo"])
			.index("by_sendBy", ["sendBy"]),
		
		  orders: defineTable({
			gigId: v.id("sellerGigs"),
			serviceType: v.union(v.literal("complete"), v.literal("resources"), v.literal("tools")),
			assignedBy: v.id("users"),
			assignedTo: v.id("users"),
			amount: v.number(),
			startDate: v.string(), // ISO date string
			endDate: v.string(), // ISO date string
			paymentMethod: v.union(v.literal("cash"), v.literal("card")),
			isCustom: v.boolean(),

			status: v.union(v.literal("pending"), v.literal("approved"), v.literal("completed"), v.literal("declined"), v.literal("canceled")),
			packageName: v.optional(v.string()),
		  })
			.index("by_assignedTo", ["assignedTo"])
			.index("by_assignedBy", ["assignedBy"])
			.index("by_gigId", ["gigId"]),
		});

	


