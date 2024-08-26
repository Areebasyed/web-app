
'use client'
import { useState } from 'react'
import {  useSearchParams } from 'next/navigation'
import { useQuery } from 'convex/react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import { OrderCard } from '@/components/OrderCard'
import { OrderSkeleton } from '@/components/OrderSkeleton'

type OrderStatus = 'pending' | 'approved' | 'declined' | 'completed' | 'canceled'

export default function OrdersClient() {
  
  const searchParams = useSearchParams()
  const isSeller = searchParams.get('isSeller') === 'true' ? true : false
  const userId = searchParams.get('userId') as Id<"users">

  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')

  const sellerOrders = useQuery(api.orders.allOrdersForSeller, { sellerId: userId })
  const buyerOrders = useQuery(api.orders.allOrdersForBuyer, { buyerId: userId })

  const orders = isSeller ? sellerOrders : buyerOrders

  const filteredOrders = orders?.filter(order => 
    filter === 'all' || order.status === filter
  ) ?? []

 
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{isSeller ? 'Seller' : 'Buyer'} Orders</h1>

      <div className="mb-6">
        <Select value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {orders === undefined ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <OrderSkeleton key={index} />
          ))}
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <OrderCard 
              key={order._id}
              order={order}
              isSeller={isSeller}
              userId={userId}
            
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">No orders found.</p>
        </div>
      )}
    </div>
  )
}