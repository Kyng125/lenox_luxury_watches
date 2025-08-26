"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { X, Upload, ImageIcon, ArrowUp, ArrowDown } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  className?: string
}

export function ImageUpload({ images, onImagesChange, maxImages = 5, className = "" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})

  const uploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Upload failed")
    }

    return response.json()
  }

  const deleteImage = async (url: string) => {
    const response = await fetch("/api/admin/delete-image", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      throw new Error("Delete failed")
    }
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > maxImages) {
        alert(`Maximum ${maxImages} images allowed`)
        return
      }

      setUploading(true)
      const newImages: string[] = []

      try {
        for (const file of acceptedFiles) {
          const fileId = Math.random().toString(36)
          setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }))

          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => ({
              ...prev,
              [fileId]: Math.min((prev[fileId] || 0) + 10, 90),
            }))
          }, 100)

          const result = await uploadImage(file)
          newImages.push(result.url)

          clearInterval(progressInterval)
          setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }))
        }

        onImagesChange([...images, ...newImages])
      } catch (error) {
        console.error("Upload error:", error)
        alert("Upload failed. Please try again.")
      } finally {
        setUploading(false)
        setUploadProgress({})
      }
    },
    [images, maxImages, onImagesChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
    disabled: uploading || images.length >= maxImages,
  })

  const removeImage = async (index: number) => {
    const imageUrl = images[index]
    try {
      await deleteImage(imageUrl)
      const newImages = images.filter((_, i) => i !== index)
      onImagesChange(newImages)
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete image")
    }
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    onImagesChange(newImages)
  }

  const moveImageUp = (index: number) => {
    if (index > 0) {
      moveImage(index, index - 1)
    }
  }

  const moveImageDown = (index: number) => {
    if (index < images.length - 1) {
      moveImage(index, index + 1)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${
              isDragActive
                ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
                : "border-gray-300 hover:border-yellow-500 hover:bg-gray-50 dark:hover:bg-gray-900"
            }
            ${uploading ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {isDragActive ? "Drop images here" : "Upload product images"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Drag & drop images here, or click to select files</p>
          <p className="text-xs text-gray-400 mt-2">
            PNG, JPG, WEBP up to 5MB ({images.length}/{maxImages} images)
          </p>
        </div>
      )}

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                />

                {/* Primary Image Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded font-medium">
                    Primary
                  </div>
                )}

                {/* Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      {index > 0 && (
                        <Button size="sm" variant="secondary" onClick={() => moveImage(index, 0)} className="text-xs">
                          Primary
                        </Button>
                      )}
                      <Button size="sm" variant="destructive" onClick={() => removeImage(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      {index > 0 && (
                        <Button size="sm" variant="outline" onClick={() => moveImageUp(index)}>
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                      )}
                      {index < images.length - 1 && (
                        <Button size="sm" variant="outline" onClick={() => moveImageDown(index)}>
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <ImageIcon className="mx-auto h-12 w-12 mb-4" />
          <p>No images uploaded yet</p>
        </div>
      )}
    </div>
  )
}
