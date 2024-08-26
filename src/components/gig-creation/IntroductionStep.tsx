// components/gig-creation/IntroductionStep.tsx
import { useState } from 'react'
import { useGigStore } from '@/store/useGigStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

const serviceDescriptions = {
  complete: `A Contracting service includes team members, resources, tools, and packages. This is ideal for complex projects that require a full-service solution. You'll need to provide details about your team, the resources you'll use, any tools required, and different package options for clients.`,
  resources: `A resource selling focuses on providing specific materials or supplies. You'll need to list each resource, its quantity, unit of measurement, and price. This is suitable for businesses that primarily sell or rent out materials.`,
  tools: `A tool renting allows you to list tools available for rent. You'll need to provide details about each tool, including its name, quantity available, and rental price. This is ideal for businesses specializing in equipment rental.`,
}

export default function IntroductionStep() {
  const { basicInfo, setBasicInfo, nextStep } = useGigStore()
  const [accepted, setAccepted] = useState(false)

  const handleContinue = () => {
    if (accepted) {
      nextStep()
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome to Service Creation</CardTitle>
        <CardDescription>Choose the type of service you want to offer</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={basicInfo.serviceType } 
          onValueChange={(value: any) => setBasicInfo({ serviceType: value })}
          className="space-y-4"
        >
          {Object.entries(serviceDescriptions).map(([type, description]) => (
            <div key={type} className="flex items-start space-x-3">
              <RadioGroupItem value={type} id={type} className="mt-1" />
              <div className="flex-grow">
                <Label htmlFor={type} className="text-base font-semibold">
                 {type == "complete"? "Contract" : type == "resources" ? "Resource Selling" : "Tool Renting"}
                </Label>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>

        <ScrollArea className="h-40 rounded-md border p-4">
          <div className="text-sm">
            <h4 className="font-medium">Terms and Conditions</h4>
            <p>
              Please read and accept our terms and conditions before proceeding:
              1. All information provided must be accurate and up-to-date.
              2. You are responsible for delivering the services as described.
              3. Compliance with local laws and regulations is your responsibility.
              4. Our platform fee is 20% of the total transaction.
              5. Payment will be released 7 days after service completion, pending customer satisfaction.
            </p>
          </div>
        </ScrollArea>

        <div className="flex items-center space-x-2">
          <Checkbox id="terms" checked={accepted} onCheckedChange={(checked: boolean) => setAccepted(checked)} />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I accept the terms and conditions
          </label>
        </div>

        <Button onClick={handleContinue} disabled={!accepted} className="w-full">
          Accept and Continue
        </Button>
      </CardContent>
    </Card>
  )
}