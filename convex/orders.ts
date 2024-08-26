import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const assignContractOrderRequest = mutation({
   
  args: {
    gigId: v.id("sellerGigs"),
    buyerId: v.id("users"),
    sellerId: v.id("users"),
    packageName: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    isCustom: v.optional(v.boolean()),
    paymentMethod: v.union(v.literal("cash"), v.literal("card")),
    amount: v.number(),
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
    if (!user || user._id !== args.buyerId) {
      return null; // Return null if user not found
    }
    // Create the order
    const orderId = await ctx.db.insert("orders", {
      gigId: args.gigId,
      serviceType: "complete", // Assuming it's always complete for now
      assignedBy: args.buyerId,
      assignedTo: args.sellerId,
      amount: args.amount,
      startDate: args.startDate,
      endDate: args.endDate,
      paymentMethod: args.paymentMethod,
      isCustom: false,
      status: "pending",
      packageName: args.packageName,
      
    });

    // Create a notification for the seller
    await ctx.db.insert("notifications", {
      notificationType: "order",
       content: `
      New Order Request:
      
      Package: ${args.packageName}
      Custom Package: ${args.isCustom ? "Yes" : "No"}
      Amount: $${args.amount.toFixed(2)}
      Duration: ${args.startDate} to ${args.endDate}
      Payment Method: ${args.paymentMethod.charAt(0).toUpperCase() + args.paymentMethod.slice(1)}
      
      Client Details:
      Name: ${user.name}
      Email: ${user.email}
      
      Please review and respond to this order request.
            `,
      sendBy: args.buyerId,
      sendTo: args.sellerId,  
      isRead: false,
      orderId: orderId
    });

    return orderId;
  },
});

export const assignResourceOrderRequest = mutation({
  args: {
    gigId: v.id("sellerGigs"),
    buyerId: v.id("users"),
    sellerId: v.id("users"),
    orderItems: v.array(v.object({
      resourceName: v.string(),
      quantity: v.number(),
      price: v.number(),
    })),
    isCustom: v.boolean(),
    paymentMethod: v.union(v.literal("cash"), v.literal("card")),
    amount: v.number(),
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

    if (!user || user._id !== args.buyerId) {
      return null; // Return null if user not found
    }

    // Create the order
    const orderId = await ctx.db.insert("orders", {
      gigId: args.gigId,
      serviceType: "resources",
      assignedBy: args.buyerId,
      assignedTo: args.sellerId,
      amount: args.amount,
      startDate: new Date().toISOString(), // Current date as start date
      endDate: new Date().toISOString(), // Same as start date for resource orders
      paymentMethod: args.paymentMethod,
      isCustom: args.isCustom,
      status: "pending",
      // We don't set packageName for resource orders
    });

    // Create a notification for the seller
    await ctx.db.insert("notifications", {
      notificationType: "order",
      content: `
      New Resource Order Request:
      
      ${args.orderItems.map(item => `
      Resource: ${item.resourceName}
      Quantity: ${item.quantity}
      Price per unit: $${item.price.toFixed(2)}
      Subtotal: $${(item.quantity * item.price).toFixed(2)}
      `).join('\n')}
      
      Total Amount: $${args.amount.toFixed(2)}
      Custom Order: ${args.isCustom ? "Yes" : "No"}
      Payment Method: ${args.paymentMethod.charAt(0).toUpperCase() + args.paymentMethod.slice(1)}
      
      Client Details:
      Name: ${user.name}
      Email: ${user.email}
      
      Please review and respond to this order request.
      `,
      sendBy: args.buyerId,
      sendTo: args.sellerId,  
      isRead: false,
      orderId: orderId
    });

    return orderId;
  },
});

export const assignToolOrderRequest = mutation({
  args: {
    gigId: v.id("sellerGigs"),
    buyerId: v.id("users"),
    sellerId: v.id("users"),
    orderItems: v.array(v.object({
      toolName: v.string(),
      quantity: v.number(),
      price: v.number(),
    })),
    isCustom: v.boolean(),
    paymentMethod: v.union(v.literal("cash"), v.literal("card")),
    amount: v.number(),
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

    if (!user || user._id !== args.buyerId) {
      return null; // Return null if user not found
    }

    // Create the order
    const orderId = await ctx.db.insert("orders", {
      gigId: args.gigId,
      serviceType: "tools",
      assignedBy: args.buyerId,
      assignedTo: args.sellerId,
      amount: args.amount,
      startDate: new Date().toISOString(), // Current date as start date
      endDate: new Date().toISOString(), // Same as start date for tool rental orders
      paymentMethod: args.paymentMethod,
      isCustom: args.isCustom,
      status: "pending",
      // We don't set packageName for tool rental orders
    });

    // Create a notification for the seller
    await ctx.db.insert("notifications", {
      notificationType: "order",
      content: `
      New Tool Rental Request:
      
      ${args.orderItems.map(item => `
      Tool: ${item.toolName}
      Quantity: ${item.quantity}
      Rental Price per Tool: $${item.price.toFixed(2)}
      Subtotal: $${(item.quantity * item.price).toFixed(2)}
      `).join('\n')}
      
      Total Rental Amount: $${args.amount.toFixed(2)}
      Custom Order: ${args.isCustom ? "Yes" : "No"}
      Payment Method: ${args.paymentMethod.charAt(0).toUpperCase() + args.paymentMethod.slice(1)}
      
      Client Details:
      Name: ${user.name}
      Email: ${user.email}
      
      Please review and respond to this tool rental request.
      `,
      sendBy: args.buyerId,
      sendTo: args.sellerId,  
      isRead: false,
      orderId: orderId
    });

    return orderId;
  },
});
 
export const allOrdersForSeller = query({
  args: { sellerId: v.id("users") },
  handler: async (ctx, args) => {

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null; // Instead of throwing an error, return null for unauthenticated users
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user || user._id !== args.sellerId) {
      return null; // Return null if user not found
    }

    return ctx.db
      .query("orders")
      .withIndex("by_assignedTo", (q) => q.eq("assignedTo", args.sellerId))
      .collect();
  },
})

export const allOrdersForBuyer = query({
  args: { buyerId: v.id("users") },
  handler: async (ctx, args) => {

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null; // Instead of throwing an error, return null for unauthenticated users
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user || user._id !== args.buyerId) {
      return null; // Return null if user not found
    }
    return ctx.db
      .query("orders")
      .withIndex("by_assignedBy", (q) => q.eq("assignedBy", args.buyerId))
      .collect();
  },
})

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    newStatus: v.union(v.literal("approved"), v.literal("declined"), v.literal("completed"), v.literal("canceled")),
    updatedBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { orderId, newStatus, updatedBy } = args;

    const order = await ctx.db.get(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    const isSeller = order.assignedTo === updatedBy;
    const isBuyer = order.assignedBy === updatedBy;

    if (isSeller && order.status !== "pending") {
      throw new Error("Seller can only update pending orders");
    }

    if (isBuyer && order.status !== "approved") {
      throw new Error("Buyer can only update approved orders");
    }

    if (
      (isSeller && (newStatus !== "approved" && newStatus !== "declined")) ||
      (isBuyer && (newStatus !== "completed" && newStatus !== "canceled"))
    ) {
      throw new Error("Invalid status update");
    }

    await ctx.db.patch(orderId, { status: newStatus });

    // Send notification
    const notificationContent = getNotificationContent(newStatus, isSeller);
    await ctx.db.insert("notifications", {
      notificationType: "order",
      content: notificationContent,
      orderId,
      sendBy: updatedBy,
      sendTo: isSeller ? order.assignedBy : order.assignedTo,
      isRead: false,
    });

    return { success: true };
  },
});

function getNotificationContent(status: string, isSeller: boolean): string {
  if (isSeller) {
    return status === "approved"
      ? "Your order has been approved by the seller."
      : "Your order has been declined by the seller.";
  } else {
    return status === "completed"
      ? "The buyer has marked the order as completed. Payment will be processed soon."
      : "The buyer has canceled the order.";
  }
}

