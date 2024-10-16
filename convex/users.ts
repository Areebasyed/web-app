import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

export const createUser = internalMutation({
	args: {
		tokenIdentifier: v.string(),
		email: v.string(),
		name: v.string(),
		image: v.string(),
	},
	handler: async (ctx, args) => {
		await ctx.db.insert("users", {
			tokenIdentifier: args.tokenIdentifier,
			email: args.email,
			name: args.name,
			profileImage: args.image,
			isOnline: true,
		});
	},
});

export const updateUser = internalMutation({
	args: { tokenIdentifier: v.string(), image: v.string() },
	async handler(ctx, args) {
		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
			.unique();

		if (!user) {
			console.log("User not found");
			throw new ConvexError("User not found");
		}

		await ctx.db.patch(user._id, {
			profileImage: args.image,
		});
	},
});

export const setUserOnline = internalMutation({
	args: { tokenIdentifier: v.string() },
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
			.unique();

		if (!user) {
			throw new ConvexError("User not found");
		}

		await ctx.db.patch(user._id, { isOnline: true });
	},
});

export const setUserOffline = internalMutation({
	args: { tokenIdentifier: v.string() },
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
			.unique();

		if (!user) {
			throw new ConvexError("User not found");
		}

		await ctx.db.patch(user._id, { isOnline: false });
	},
});
export const deleteUser = internalMutation({
	args: { tokenIdentifier: v.string() },
	async handler(ctx, args) {
		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
			.unique();
		if (!user) {
			throw new ConvexError("User not found");
		}
		await ctx.db.delete(user._id);
		
}});		


export const getUsers = query({
	args: {},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		
		if (!identity) {
			throw new ConvexError("Unauthorized access");
		}

		const users = await ctx.db.query("users").collect();
		
		return users.filter((user) => user.tokenIdentifier !== identity.tokenIdentifier);
	},
});

export const getMe = query({
	args: {},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError("Unauthorized");
		}

		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
			.unique();

		if (!user) {
			throw new ConvexError("User not found");
		}

		return user;
	},
})

export const updateUserStatusAsSeller = mutation({
	args: {
		toggle: v.boolean(),
	},
	async handler(ctx, args) {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new ConvexError("Unauthorized");

		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
			.unique();

		if (!user) throw new ConvexError("User not found");

		await ctx.db.patch(user._id, { Asseller: args.toggle });

	}
})


// fetch User detail by its id using where clause in convex

export const getUserById = query({
	args: {
		userId: v.id("users") ,
	},
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.filter((q) => q.eq(q.field("_id"), args.userId))
			.unique();
		return user
	}
})

