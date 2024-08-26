// components/gig-creation/ResourcesForm.tsx
import { useCallback, useState } from 'react'
import { useGigStore } from '@/store/useGigStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2 ,Upload, X} from 'lucide-react'
import { api } from '../../../convex/_generated/api'
import { useMutation } from 'convex/react'
import { useDropzone } from 'react-dropzone'
import { Id } from '../../../convex/_generated/dataModel'
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CONSTRUCTION_RESOURCES,  } from '../../lib/types/construction_Data' 
import {  useToast } from '../ui/use-toast'

export default function ResourcesForm() {
  const [resource, setResource] = useState({ name: '', quantity: 0, unit: '', pricePerResource: 0 ,  imageId: '' as Id<"_storage">})
  const { resources, addResource, removeResource,basicInfo } = useGigStore()
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { toast } = useToast()
  

  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    const url = await generateUploadUrl()
    
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url  )
    xhr.setRequestHeader('Content-Type', file.type)
    
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100
        setUploadProgress(percentComplete)
      }
    }
    
    xhr.onload = async () => {
      if (xhr.status === 200) {
        const { storageId } = JSON.parse(xhr.responseText)
        setResource(prev => ({ ...prev, imageId: storageId as Id<"_storage"> }))
        setUploadProgress(0)
      }
    }
    
    xhr.send(file)
  }, [generateUploadUrl])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 })

  const handleAddResource = () => {
    console.log(resource)
    if (resource.name && resource.quantity > 0 && resource.unit && resource.pricePerResource > 0 && resource.imageId) {
      addResource(resource)
      setResource({ name: '', quantity: 0, unit: '', pricePerResource: 0, imageId: '' as Id<"_storage"> })
    }
    else{
      toast({
        title: 'Error',
        description: 'Please fill all the required fields',
        variant: 'destructive',
      })
    }
  }

  const handleResourceSelect = (selectedName: string) => {
    const selectedResource = CONSTRUCTION_RESOURCES.find(r => r.name === selectedName)
    if (selectedResource) {
      setResource(prev => ({ ...prev, name: selectedResource.name, unit: selectedResource.unit }))
    }
  }

  const handleRemoveImage = () => {
    setResource(prev => ({ ...prev, imageId: '' as Id<"_storage"> }))
  }

  

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Resources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
        <div>
            <Label htmlFor="name">Resource Name</Label>
            <Select onValueChange={handleResourceSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a resource" />
              </SelectTrigger>
              <SelectContent>
                {CONSTRUCTION_RESOURCES.map((res) => (
                  <SelectItem key={res.name} value={res.name}>
                    {res.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        <div className="col-span-2">
            <Label>Resource Image</Label>
            {!resource.imageId && (
              <div {...getRootProps()} className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer">
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the image here ...</p>
                ) : (
                  <div>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p>Drag N drop an image here, or click to select one</p>
                  </div>
                )}
              </div>
            )}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-gray-500 mt-1">Uploading: {Math.round(uploadProgress)}%</p>
              </div>
            )}
            {resource.imageId && (
              <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 rounded">
                <span className="text-sm text-gray-700">Image uploaded successfully</span>
                <Button variant="ghost" size="sm" onClick={handleRemoveImage}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="quantity">{basicInfo.serviceType ==="complete"? "Quantity added to service" : "Stock avaliable of the resource"} </Label>
            <Input
              required
              id="quantity"
              type="number"
              value={resource.quantity}
              onChange={(e) => setResource({ ...resource, quantity: parseInt(e.target.value) || 0 })}
              placeholder="e.g., 100"
            />
          </div>
         
          <div>
          <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              value={resource.unit}
              readOnly
              placeholder="Unit will be set automatically"
            />
            
          </div>
          <div>
            <Label htmlFor="price">Price Per Resource </Label>
            <Input
              id="price"
              required
              type="number"
              value={resource.pricePerResource}
              onChange={(e) => setResource({ ...resource, pricePerResource: parseFloat(e.target.value) || 0 })}
              placeholder="Per per resource"
            />
          </div>
        </div>
        <Button onClick={handleAddResource} className="w-full">Add Resource</Button>

        {resources.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Quantity Available</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Price Per Resource</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((res, index) => (
                <TableRow key={index}>
                  <TableCell>{res.name}</TableCell>
                  <TableCell>{res.quantity}</TableCell>
                  <TableCell>{res.unit}</TableCell>
                  <TableCell>{res.pricePerResource ? `$${res.pricePerResource.toFixed(2)}` : 'N/A'}</TableCell>
                  <TableCell>{res.imageId ? 'Uploaded' : 'No image'}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => removeResource(res.name)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}