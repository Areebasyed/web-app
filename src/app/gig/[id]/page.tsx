'use client'

import React from 'react'
import { useMutation, useQuery } from 'convex/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Edit, MessageSquare } from 'lucide-react'
import { Id } from '../../../../convex/_generated/dataModel'
import { api } from '../../../../convex/_generated/api'
import { SellerGig } from '@/lib/types/gig';
import { useMe } from '@/store/useME'
import { useToast } from '@/components/ui/use-toast'
import { ChatPopup } from '@/components/ChatPopup'
import { AssignOrderDialog } from '@/components/AssginOrderDialogue'
import { AssignOrderResourceDialog } from '@/components/AssignOrderDialogueResources'
import { AssignOrderToolDialog } from '@/components/AssignOrderDialogueTool'
import { ResourceCard, ServiceResourceSection } from '@/components/ResourseCard'
import { ServiceToolSection } from '@/components/ToolCard'
import { ServiceCompleteSection } from '@/components/ServiceCompleteSection'

export default function GigPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
 
  const { me } = useMe()
  const { toast } = useToast()
  const isSeller = searchParams.get('isSeller') === 'true' ? true : false
  const gigId = params.id as Id<"sellerGigs">

  const gig: SellerGig | undefined = useQuery(api.sellerGigs.getGigById, { gigId: gigId })
  
  const gigChat = useQuery(api.chat.getChatByGigId, { gigId: gigId })
  const createChat = useMutation(api.chat.createChat)

  if (gig === undefined) {
    return <GigSkeleton />
  }

  if (gig === null) {
    return <div className="text-center py-12 text-gray-700 dark:text-gray-300">Gig not found</div>
  }

  const handleChatCreate = async () => {
    try {
      await createChat({ gigId: gigId, sellerId: gig.userId, buyerId: me?._id! })
      toast({
        title: "Chat created",
        description: "Chat has been created successfully.",
        variant: "default",
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8 bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-gray-900 dark:text-gray-100">{gig.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{gig.description}</p>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Service Details</h3>
            <p className="text-gray-700 dark:text-gray-300"><strong>Type:</strong> {gig.serviceType}</p>
            {renderServiceDetails(gig)}
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-end gap-4">
          
          {!isSeller && (gigChat === undefined || gigChat === null) && (
            <Button 
              variant="outline" 
              onClick={handleChatCreate}
              className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <MessageSquare className="mr-2 h-4 w-4" /> Chat with Seller
            </Button>
          )}
          {!isSeller && gig.serviceType === 'complete' && (
            <AssignOrderDialog gig={gig} buyerId={me?._id!} />
          )}
          {!isSeller && gig.serviceType === 'resources' && (
            <AssignOrderResourceDialog gig={gig} buyerId={me?._id!} />
          )}
          {!isSeller && gig.serviceType === 'tools' && (
            <AssignOrderToolDialog gig={gig} buyerId={me?._id!} />
          )}
          {gigChat && (
            <ChatPopup gigChatId={gigChat._id!} />
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

function renderServiceDetails(gig: SellerGig) {
  switch (gig.serviceType) {
    case 'complete':
  return <ServiceCompleteSection completeService={gig?.completeService } />
    
      
    case 'resources':
      return (
    <ServiceResourceSection 
  title="Available Resources" 
  items={gig.resourceService}

    />
      )
    case 'tools':
      return (
        <ServiceToolSection 
        title="Available Tools" 
        items={gig.toolService}
      />
      )
  }
}



function ServiceSection({ title, items }: { title: string, items?: string[] }) {
  if (!items || items.length === 0) return null
  return (
    <div>
      <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-200">{title}</h3>
      <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

function GigSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8 bg-white dark:bg-gray-800">
        <CardHeader>
          <Skeleton className="h-10 w-2/3 bg-gray-200 dark:bg-gray-700" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-4 w-full mb-2 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-4 w-2/3 mb-4 bg-gray-200 dark:bg-gray-700" />
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <Skeleton className="h-6 w-1/4 mb-4 bg-gray-200 dark:bg-gray-600" />
            <Skeleton className="h-4 w-full mb-2 bg-gray-200 dark:bg-gray-600" />
            <Skeleton className="h-4 w-full mb-2 bg-gray-200 dark:bg-gray-600" />
            <Skeleton className="h-4 w-full mb-2 bg-gray-200 dark:bg-gray-600" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Skeleton className="h-10 w-32 mr-2 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-10 w-32 bg-gray-200 dark:bg-gray-700" />
        </CardFooter>
      </Card>
    </div>
  )
}