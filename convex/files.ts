import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {

	const identity = await ctx.auth.getUserIdentity();
		  if (!identity) {
			  throw new ConvexError("Unauthorized");
		  }
  
		  const user = await ctx.db
			  .query("users")
			  .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
			  .unique();
  
		  if (!user || !user.Asseller) {
			  throw new ConvexError("Unauthorized");
		  }
	return await ctx.storage.generateUploadUrl();
});



export const getImageUrl = query({

	args: { imageId: v.id("_storage") },
	
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
			  throw new ConvexError("Unauthorized");
		  }
  
	  const url =  await ctx.storage.getUrl(args.imageId)
	  return url
	},
  })