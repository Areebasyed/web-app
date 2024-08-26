// convex/gigs.ts
import { mutation, query } from './_generated/server'
import { ConvexError, v } from 'convex/values'

export const createGig = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    serviceType: v.union(v.literal('complete'), v.literal('resources'), v.literal('tools')),
    completeService: v.optional(v.object({
      teamMembers: v.array(v.string()),
      resources: v.array(v.object({
        name: v.string(),
        quantity: v.number(),
        unit: v.string(),
        pricePerResource: v.number(),
        
      })),
      tools: v.array(v.object({
        name: v.string(),
        quantity: v.number(),
        rentalPricePerTool: v.number(),
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
  },
  handler: async (ctx, args) => {
    const { userId } = args;


    
    
    
    const user = await ctx.db.get(userId);
    if (!user || !user.Asseller) {
      throw new Error('User is not authorized to create a gig');
    }

   
   const gigId = await ctx.db.insert('sellerGigs', {
      ...args,
     
    });

     return gigId;
  },
})





export const getSellerGigs = query({

  args: { userId: v.id("users") },
  
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

    const gigs = await ctx.db
      .query('sellerGigs')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .collect()
    return gigs
  },
})




export const getGigById = query({
  args: { gigId: v.id('sellerGigs') },
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
    const gig = await ctx.db.get(args.gigId)
    if (!gig) throw new Error('Gig not found')
    return gig
  },
})

// convex/gigs.ts


export const getAllGigsExceptUser = query({
  args: { userId: v.id("users") },


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

    const gigs = await ctx.db
      .query('sellerGigs')
      .filter((q) => q.neq(q.field('userId'), args.userId))
      .collect()
    return gigs
  },
})