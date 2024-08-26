import { Id } from "../../../convex/_generated/dataModel"


 export type ContractOrder={
    _id: Id<"orders">,
    gigId: Id<"sellerGigs">,
    serviceType: "complete" | "resources" | "tools",
    assignedBy: Id<"users">,
    assignedTo: Id<"users">,
    amount: number,
    startDate: string, // ISO date string
    endDate: string, // ISO date string
    paymentMethod: "cash" | "card",
    isCustom: boolean,
    status: "pending" | "approved" | "declined" | "completed" | "canceled",
    packageName?: string,
  }
 