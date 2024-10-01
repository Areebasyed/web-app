'use client'
import { useGigStore } from '@/store/useGigStore'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useRouter, useSearchParams } from 'next/navigation'
import IntroductionStep from '@/components/gig-creation/IntroductionStep'
import BasicInfoForm from '@/components/gig-creation/BasicInfoForm'
import TeamMembersForm from '@/components/gig-creation/TeamMembersForm'
import ResourcesForm from '@/components/gig-creation/ResourcesForm'
import ToolsForm from '@/components/gig-creation/ToolsForm'
import ServiceImagesForm from '@/components/gig-creation/ServiceImageForm'
import PackagesForm from '@/components/gig-creation/PackagesForm'
import { Id } from '../../../convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'

export function CreateSellerGigClient() {
  const { currentStep, basicInfo, nextStep, prevStep, submitGig,reset } = useGigStore()
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId') as Id<"users">
  const isSeller = searchParams.get('isSeller') === 'true'
  const createGig = useMutation(api.sellerGigs.createGig)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const handleCreateGig = async () => {
    if (!isSeller) {
      toast({
        title: "Error",
        description: "You must be in seller mode to create a service.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const gigData = submitGig()
      gigData.userId = userId
     
      await createGig(gigData)
      toast({
        title: "Success",
        description: "Your service has been created successfully!",
      })
      reset()   
      router.push('/')
     
    } catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: "Failed to create service. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getSteps = () => {
    const commonSteps = [IntroductionStep, BasicInfoForm]
    switch (basicInfo.serviceType) {
      case 'complete':
        return [...commonSteps,ServiceImagesForm, TeamMembersForm, ResourcesForm, ToolsForm, PackagesForm]
      case 'resources':
        return [...commonSteps, ResourcesForm]
      case 'tools':
        return [...commonSteps, ToolsForm]
      default:
        return commonSteps
    }
  }

  const steps = getSteps()
  const totalSteps = steps.length
  const progress = (currentStep / totalSteps) * 100
  const CurrentStepComponent = steps[currentStep - 1]
  const isLastStep = currentStep === totalSteps

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Create Your Seller Service</h1>
      <Progress value={progress} className="mb-6" />
      {CurrentStepComponent && <CurrentStepComponent />}
      <div className="flex justify-between mt-6">
        {currentStep > 1 && (
          <Button onClick={prevStep} variant="outline">
            Previous
          </Button>
        )}
        {!isLastStep ? (
          <Button onClick={nextStep} className="ml-auto">
            Next
          </Button>
        ) : (
          <Button onClick={handleCreateGig} className="ml-auto" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Service'}
          </Button>
        )}
      </div>
    </div>
  )
}