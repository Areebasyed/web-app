import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'

interface Tool {
  name: string
  quantity: number
  rentalPricePerTool: number
  imageId?: Id<"_storage">
}

export function ToolCard({ tool }: { tool: Tool }) {
  const getImageUrl = useQuery(api.files.getImageUrl, { imageId: tool?.imageId as Id<"_storage"> })

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{tool.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        {/* {getImageUrl && (
          <div className="mb-4 flex-grow">
            <img 
              src={getImageUrl} 
              alt={tool.name} 
              className="w-full h-48 object-cover rounded-md"
            />
          </div>
        )} */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Available: {tool.quantity}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Rental Price: ${tool.rentalPricePerTool} per tool
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function ServiceToolSection({ title, items }: { title: string, items?: Tool[] }) {
  if (!items || items.length === 0) return null

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <ToolCard key={index} tool={item} />
        ))}
      </div>
    </div>
  )
}