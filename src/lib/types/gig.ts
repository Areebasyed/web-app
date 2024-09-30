// types/gig.ts

import { Id } from "../../../convex/_generated/dataModel"


export interface SellerGig {
  _id: Id<"sellerGigs">
  userId: Id<"users">
  title: string
  _creationTime: number;
  description: string
  location: string
  serviceType: "complete" | "resources" | "tools"
  completeService?: {
    teamMembers: string[]
    resources: {
      name: string
      quantity: number
      unit: string
      pricePerResource: number
      imageId?: Id<"_storage">
    }[]
    tools: {
      name: string
      quantity: number
      rentalPricePerTool: number
      imageId?: Id<"_storage">
    }[]
    packages: {
      name: string
      teamSize: number
      resourceCount: number
      toolCount: number
      budget: number
      deliveryTime: number
    }[]
  }
  resourceService?: {
    name: string
    quantity: number
    unit: string
    pricePerResource: number
    imageId?: Id<"_storage">
  }[]
  toolService?: {
    name: string
    quantity: number
    rentalPricePerTool: number
    imageId?: Id<"_storage">
  }[]
}