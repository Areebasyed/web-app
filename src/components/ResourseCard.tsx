import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import Image from 'next/image'

interface Resource {
  name: string
  quantity: number
  unit: string
  pricePerResource: number
  imageId?: Id<"_storage">
}

export function ResourceCard({ resource }: { resource: Resource }) {
  const getImageUrl = useQuery(api.files.getImageUrl, { imageId: resource?.imageId as Id<"_storage"> })

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{resource.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        {getImageUrl && (
          <div className="mb-4 flex-grow">
            <Image src={getImageUrl} alt={resource.name} width={500} height={500} className=" object-cover rounded-md"/>
          </div>
        )}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Available: {resource.quantity} {resource.unit}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Price: ${resource.pricePerResource} per {resource.unit}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function ServiceResourceSection({ title, items }: { title: string, items?: Resource[] }) {
  if (!items || items.length === 0) return null

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <ResourceCard key={index} resource={item} />
        ))}
      </div>
    </div>
  )
}