// components/gig-creation/ToolsForm.tsx
import { useCallback, useState } from 'react'
import { useGigStore } from '@/store/useGigStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Plus,Upload,X } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { api } from '../../../convex/_generated/api'
import { useMutation } from 'convex/react'
import { useDropzone } from 'react-dropzone'
import { Id } from '../../../convex/_generated/dataModel'
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {  CONSTRUCTION_TOOLS,  } from '../../lib/types/construction_Data' 



export default function ToolsForm() {
  const [tool, setTool] = useState({ name: '', quantity: 0, rentalPricePerTool: 0, imageId: '' as Id<"_storage"> })
  const { tools, addTool, removeTool ,basicInfo} = useGigStore()
  const { toast } = useToast()
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const [uploadProgress, setUploadProgress] = useState(0)


  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    const url = await generateUploadUrl()
    
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url)
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
        setTool(prev => ({ ...prev, imageId: storageId as Id<"_storage"> }))
        setUploadProgress(0)
      }
    }
    
    xhr.send(file)
  }, [generateUploadUrl])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 })



  const handleRemoveImage = () => {
    setTool(prev => ({ ...prev, imageId: '' as Id<"_storage"> }))
  }


  const handleAddTool = () => {
    if (tool.name && tool.quantity > 0 && tool.rentalPricePerTool > 0 && tool.imageId) {
      
      addTool(tool)
      setTool({ name: '', quantity: 0, rentalPricePerTool: 0, imageId: '' as Id<"_storage"> })
      toast({
        title: "Tool added",
        description: `${tool.name} has been added to the tool list.`,
      })
    } else {
      toast({
        title: "Invalid input",
        description: "Please fill in all fields with valid values.",
        variant: "destructive",
      })
    }
  }

  const handleToolSelect = (selectedName: string) => {
    const selectedTool = CONSTRUCTION_TOOLS.find(r => r.name === selectedName)
    if (selectedTool) {
      setTool(prev => ({ ...prev, name: selectedTool.name}))
    }
  }

  const handleRemoveTool = (name: string) => {
    removeTool(name)
    toast({
      title: "Tool removed",
      description: `${name} has been removed from the tool list.`,
    })
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
          <Label htmlFor="name">Tool Name</Label>
            <Select onValueChange={handleToolSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a resource" />
              </SelectTrigger>
              <SelectContent>
                {CONSTRUCTION_TOOLS.map((res) => (
                  <SelectItem key={res.name} value={res.name}>
                    {res.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label>Resource Image</Label>
            {!tool.imageId && (
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
            {tool.imageId && (
              <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 rounded">
                <span className="text-sm text-gray-700">Image uploaded successfully</span>
                <Button variant="ghost" size="sm" onClick={handleRemoveImage}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <div>
          <Label htmlFor="quantity">{basicInfo.serviceType ==="complete"? "Quantity added to service" : "Stock avaliable of the tool"} </Label>
            <Input
              id="quantity"
              type="number"
              value={tool.quantity}
              onChange={(e) => setTool({ ...tool, quantity: parseInt(e.target.value) || 0 })}
              placeholder="e.g., 5"
            />
          </div>
          <div>
            <Label htmlFor="rentalPrice">Rental Price Per Tool</Label>
            <Input
              id="rentalPrice"
              type="number"
              value={tool.rentalPricePerTool}
              onChange={(e) => setTool({ ...tool, rentalPricePerTool: parseFloat(e.target.value) || 0 })}
              placeholder="Price Per tool"
            />
          </div>

          <div>
          <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              value={CONSTRUCTION_TOOLS.find(t => t.name === tool.name)?.unit}
              readOnly
              placeholder="Unit will be set automatically"
            />
            
          </div>
        </div>
        <Button onClick={handleAddTool} className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add Tool
        </Button>

        {tools.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Rental Price Per Tool</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tools.map((t, index) => (
                <TableRow key={index}>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.quantity}</TableCell>
                  <TableCell>${t.rentalPricePerTool.toFixed(2)}</TableCell>
                  <TableCell>{tool.imageId ? 'Uploaded' : 'No image'}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveTool(t.name)}>
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