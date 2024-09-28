// components/GigCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SellerGig } from "../lib/types/gig"
import { Badge } from "@/components/ui/badge"
import { Users, Package, MapPin } from 'lucide-react'

export function GigCard({ gig }: { gig: SellerGig }) {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-200 w-full overflow-hidden relative">
      <CardHeader className="bg-gray-50 dark:bg-gray-700">
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
          {gig.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {gig.description.slice(0, 100)}...
        </p>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {gig.serviceType == 'complete' ? 'Contracts' : gig.serviceType}
          </Badge>
          {gig.serviceType === 'complete' && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Users className="h-4 w-4 mr-1" />
              {gig.completeService?.teamMembers.length} members
            </div>
          )}
          {gig.serviceType === 'resources' && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Package className="h-4 w-4 mr-1" />
              {gig.resourceService?.length} resources
            </div>
          )}
          {gig.serviceType === 'tools' && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              {gig.toolService?.length} tools
            </div>
          )}
        </div>
      </CardContent>
      <Badge 
        variant="outline" 
        className="absolute top-2 right-2 text-xs font-normal bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600"
      >
        <MapPin className="h-3 w-3 mr-1" />
        {gig.location}
      </Badge>
    </Card>
  )
}