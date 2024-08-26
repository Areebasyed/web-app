import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
  const [isImageOpen, setIsImageOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>('')
  const getImageUrl = useQuery(api.files.getImageUrl, { imageId: tool?.imageId as Id<"_storage"> })

  const handleViewImage = async () => {
    if (tool.imageId) {
      if (getImageUrl) {
        setImageUrl(getImageUrl)
        setIsImageOpen(true)
      }
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{tool.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Available: {tool.quantity}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Rental Price: ${tool.rentalPricePerTool} per tool
        </p>
        {tool?.imageId && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2" 
            onClick={handleViewImage}
          >
            View Image
          </Button>
        )}
      </CardContent>

      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tool.name}</DialogTitle>
          </DialogHeader>
          {imageUrl && <img src={imageUrl} alt={tool.name} className="w-full h-auto" />}
        </DialogContent>
      </Dialog>
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