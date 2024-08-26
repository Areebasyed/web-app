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

export default function GigPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const router = useRouter()
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
          {isSeller && (
            <Button
              variant="outline"
              onClick={() => router.push(`/edit-gig/${gigId}`)}
              className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <Edit className="mr-2 h-4 w-4" /> Edit Gig
            </Button>
          )}
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
      return (
        <div className="space-y-4">
          <ServiceSection title="Team Members" items={gig.completeService?.teamMembers} />
          <ServiceSection 
            title="Resources" 
            items={gig.completeService?.resources.map(r => `${r.name}: ${r.quantity} ${r.unit} ($${r.pricePerResource} per ${r.unit})`)} 
          />
          <ServiceSection 
            title="Tools" 
            items={gig.completeService?.tools.map(t => `${t.name}: ${t.quantity} available ($${t.rentalPricePerTool} rental per tool)`)} 
          />
          <div>
            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-200">Packages</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gig.completeService?.packages.map((pkg, index) => (
                <Card key={index} className="bg-white dark:bg-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-800 dark:text-gray-200">{pkg.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-700 dark:text-gray-300">
                    <p>Team Size: {pkg.teamSize}</p>
                    <p>Resources: {pkg.resourceCount}</p>
                    <p>Tools: {pkg.toolCount}</p>
                    <p>Budget: ${pkg.budget}</p>
                    <p>Delivery Time: {pkg.deliveryTime} days</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )
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