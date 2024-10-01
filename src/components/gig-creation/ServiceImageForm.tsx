import React, { useCallback, useState } from 'react'
import { useGigStore } from '@/store/useGigStore'
import { useDropzone } from 'react-dropzone'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Upload, X } from 'lucide-react'
import { useToast } from '../ui/use-toast'

export default function ServiceImagesForm() {
  const { basicInfo, setBasicInfo } = useGigStore()
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const { toast } = useToast()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const url = await generateUploadUrl()
      
      const xhr = new XMLHttpRequest()
      xhr.open('POST', url)
      xhr.setRequestHeader('Content-Type', file.type)
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100
          setUploadProgress(prev => ({ ...prev, [file.name]: percentComplete }))
        }
      }
      
      xhr.onload = async () => {
        if (xhr.status === 200) {
          const { storageId } = JSON.parse(xhr.responseText)
          setBasicInfo({
            completeService: {
              ...basicInfo.completeService,
              serviceImages: [...(basicInfo.completeService?.serviceImages || []), storageId as Id<"_storage">]
            }
          })
          setUploadProgress(prev => {
            const newProgress = { ...prev }
            delete newProgress[file.name]
            return newProgress
          })
          toast({
            title: 'Success',
            description: `Image ${file.name} has been added successfully.`,
          })
        }
      }
      
      xhr.send(file)
    }
  }, [generateUploadUrl, basicInfo, setBasicInfo, toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const removeImage = (index: number) => {
    setBasicInfo({
      completeService: {
        ...basicInfo.completeService,
        serviceImages: basicInfo.completeService?.serviceImages.filter((_, i) => i !== index)
      }
    })
    toast({
      title: 'Image Removed',
      description: 'The image has been removed from your service.',
    })
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Service Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div {...getRootProps()} className="border-2 border-dashed dark:border-gray-600 rounded-md p-4 text-center cursor-pointer">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-gray-600 dark:text-gray-300">Drop the images here ...</p>
          ) : (
            <div>
              <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <p className="text-gray-600 dark:text-gray-300">Drag and drop some images here, or click to select images</p>
            </div>
          )}
        </div>

        {Object.entries(uploadProgress).map(([fileName, progress]) => (
          <div key={fileName} className="mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">{fileName}</p>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Uploading: {Math.round(progress)}%</p>
          </div>
        ))}

        {basicInfo.completeService?.serviceImages && basicInfo.completeService.serviceImages.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image ID</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {basicInfo.completeService.serviceImages.map((imageId, index) => (
                <TableRow key={imageId}>
                  <TableCell>{imageId}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => removeImage(index)}>
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