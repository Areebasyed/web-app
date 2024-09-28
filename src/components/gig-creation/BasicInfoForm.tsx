// components/gig-creation/BasicInfoForm.tsx
import { useGigStore } from '@/store/useGigStore'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from '../ui/label'

export default function BasicInfoForm() {
  const {basicInfo,setBasicInfo  } = useGigStore()
  const { title, description } = basicInfo
  const setTitle = (title: string) => setBasicInfo({ ...basicInfo, title })
  const setDescription = (description: string) => setBasicInfo({ ...basicInfo, description })
  const setLocation = (location:string) => setBasicInfo({ ...basicInfo, location })



  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Provide the essential details of your service</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Service Title</Label>
          <Input
            id="title"
            value={basicInfo.title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Professional Building Construction"
          />
        </div>
        <div>
          <Label htmlFor="description">Service Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your service in detail..."
            rows={5}
          />
        </div>
        <div>
          <Label htmlFor="title">LOCATION</Label>
          <Input
            id="Location"
            value={basicInfo.location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Add location of your service"
          />
        </div>
      </CardContent>
    </Card>
  )
}