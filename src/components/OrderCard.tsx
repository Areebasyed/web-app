// components/OrderCard.tsx
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"


import { useMutation } from 'convex/react'
import { Id } from '../../convex/_generated/dataModel'
import { api } from '../../convex/_generated/api'
import { ContractOrder } from '@/lib/types/order'


interface OrderCardProps {
  order: ContractOrder
  isSeller: boolean
  userId: Id<"users">
}

export function OrderCard({ order, isSeller, userId }: OrderCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const updateOrderStatus = useMutation(api.orders.updateOrderStatus)

  const handleStatusChange = async (newStatus: "approved" | "declined" | "completed" | "canceled") => {
    setIsLoading(true)
    try {
      await updateOrderStatus({
        orderId: order._id,
        newStatus,
        updatedBy: userId,
      })
    } catch (error) {
      console.error("Failed to update order status:", error)
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsLoading(false)
    }
  }

  const getServiceTypeBadge = (serviceType: "complete" | "resources" | "tools") => {
    const colors = {
      complete: "bg-blue-100 text-blue-800",
      resources: "bg-green-100 text-green-800",
      tools: "bg-purple-100 text-purple-800"
    }
    return (
      <Badge className={`${colors[serviceType]} mr-2`}>
        {serviceType === "complete" ? "Contract" : serviceType}
      </Badge>
    )
  }

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          {getServiceTypeBadge(order.serviceType)}
          {order.packageName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Status: {order.status}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Amount: ${order.amount}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {new Date(order.startDate).toLocaleDateString()} - {new Date(order.endDate).toLocaleDateString()}
        </p>
        {isSeller && order.status === 'pending' && (
          <div className="flex space-x-2">
            <Button onClick={() => handleStatusChange('approved')} disabled={isLoading}>
              Approve
            </Button>
            <Button onClick={() => handleStatusChange('declined')} disabled={isLoading} variant="destructive">
              Decline
            </Button>
          </div>
        )}
        {!isSeller && order.status === 'approved' && (
          <div className="flex space-x-2">
            <Button onClick={() => handleStatusChange('completed')} disabled={isLoading}>
              Complete
            </Button>
            <Button onClick={() => handleStatusChange('canceled')} disabled={isLoading} variant="destructive">
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}