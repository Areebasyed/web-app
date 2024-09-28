// app/buyer-dashboard/page.tsx
'use client'

import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GigCard } from '@/components/GigCard'
import { GigSkeleton } from '@/components/GigSkelton'
import { Search, ClipboardList, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function BuyerDashboard({ userId, isSeller }: { userId: Id<"users">, isSeller: boolean }) {
  const router = useRouter()
  const [filter, setFilter] = useState<'all' | 'complete' | 'resources' | 'tools'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const gigs = useQuery(api.sellerGigs.getAllGigsExceptUser, { userId })

  const filteredGigs = gigs?.filter(gig => 
    (filter === 'all' || gig.serviceType === filter) &&
    (gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     gig.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (locationFilter === '' || gig.location.toLowerCase().includes(locationFilter.toLowerCase()))
  ) ?? []

  const handleGigClick = (gigId: Id<"sellerGigs">) => {
    router.push(`/gig/${gigId}?isSeller=${isSeller}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-white">
          Explore Available Services
        </h1>
        <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white">
          <Link href={`/orders?userId=${userId}&isSeller=false`}>
            <ClipboardList className="mr-2 h-4 w-4" /> View My Orders
          </Link>
        </Button>
      </div>

      <Card className="mb-8 bg-white dark:bg-gray-800">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative w-full md:w-1/2">
                <input
                  type="text"
                  placeholder="Search Services By name, description, or keyword"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <Select 
                value={filter} 
                onValueChange={(value) => setFilter(value as typeof filter)}
              >
                <SelectTrigger className="w-full md:w-[200px] bg-white dark:bg-gray-700">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="complete">Contracts</SelectItem>
                  <SelectItem value="resources">Resources</SelectItem>
                  <SelectItem value="tools">Tools</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Filter by location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {gigs === undefined ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <GigSkeleton key={index} />
          ))}
        </div>
      ) : filteredGigs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGigs.map((gig) => (
            <Button
              key={gig._id}
              variant="ghost"
              className="p-0 h-auto w-full transition-transform duration-200 hover:scale-105"
              onClick={() => handleGigClick(gig._id)}
            >
              <GigCard gig={gig} />
            </Button>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            No Service available at the moment.
          </p>
        </div>
      )}
    </div>
  )
}