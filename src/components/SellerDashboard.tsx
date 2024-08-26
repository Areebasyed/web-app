// app/seller-dashboard/page.tsx
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { PlusCircle, ClipboardList } from 'lucide-react'
import { Id } from '../../convex/_generated/dataModel'
import Link from "next/link"
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { GigCard } from '@/components/GigCard'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GigSkeleton } from './GigSkelton'

export default function SellerDashboard({ isSeller, userId }: { isSeller: boolean, userId: Id<"users"> }) {
  const [filter, setFilter] = useState<'all' | 'complete' | 'resources' | 'tools'>('all')
  const gigs = useQuery(api.sellerGigs.getSellerGigs, { userId })

  const filteredGigs = gigs?.filter(gig => 
    filter === 'all' || gig.serviceType === filter
  ) ?? []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Seller Dashboard</h1>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700">
            <Link href={`/orders?userId=${userId}&isSeller=true`}>
              <ClipboardList className="mr-2 h-4 w-4" /> View Orders
            </Link>
          </Button>
          <Button asChild className="bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700">
            <Link href={`/create-sellergig?userId=${userId}&isSeller=${isSeller}`}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Service
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">My Services</h2>
        <Select value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
          <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="complete">Contracts</SelectItem>
            <SelectItem value="resources">Resources</SelectItem>
            <SelectItem value="tools">Tools</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {gigs === undefined ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <GigSkeleton key={index} />
          ))}
        </div>
      ) : isSeller && filteredGigs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGigs.map((gig) => (
            <Link href={`/gig/${gig._id}?isSeller=${isSeller}`} key={gig._id} className="hover:opacity-80 transition-opacity">
              <GigCard gig={gig} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">You have not created any Service yet.</p>
          <Button asChild className="bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700">
            <Link href={`/create-sellergig?userId=${userId}&isSeller=${isSeller}`}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Service
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}