"use client"

import { useState, useCallback } from "react"
import { Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface ReceiptUploadProps {
  onExtract?: (data: { merchant?: string; amount?: number; category?: string }) => void
  disabled?: boolean
}

export function ReceiptUpload({ onExtract, disabled }: ReceiptUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const reset = useCallback(() => {
    setPreview((p) => {
      if (p) URL.revokeObjectURL(p)
      return null
    })
    setFile(null)
    setIsLoading(false)
  }, [])

  const handleFile = useCallback(
    async (f: File) => {
      if (!f.type.startsWith("image/")) return
      reset()
      setFile(f)
      setPreview(URL.createObjectURL(f))
      setIsLoading(true)

      try {
        const formData = new FormData()
        formData.append("file", f)
        const res = await fetch("/api/receipt", {
          method: "POST",
          body: formData,
        })

        if (res.ok) {
          const json = await res.json()
          onExtract?.(json as { merchant?: string; amount?: number; category?: string })
        } else {
          // Track A creates this route. Until then, mock extraction
          await new Promise((r) => setTimeout(r, 800))
          onExtract?.({
            merchant: f.name.replace(/\.[^/.]+$/, ""),
            amount: 0,
            category: "Other",
          })
        }
      } catch {
        await new Promise((r) => setTimeout(r, 500))
        onExtract?.({ merchant: "Unknown", amount: 0, category: "Other" })
      } finally {
        setIsLoading(false)
      }
    },
    [onExtract, reset]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const f = e.dataTransfer.files[0]
      if (f) handleFile(f)
    },
    [handleFile]
  )

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0]
      if (f) handleFile(f)
      e.target.value = ""
    },
    [handleFile]
  )

  return (
    <div className="flex flex-col gap-3">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={cn(
          "relative rounded-lg border-2 border-dashed transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border",
          disabled && "opacity-50 pointer-events-none"
        )}
      >
        <input
          type="file"
          accept="image/*"
          onChange={onInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={disabled}
        />
        {preview ? (
          <div className="p-4 flex items-center gap-4">
            <div className="relative size-20 rounded-lg overflow-hidden bg-muted shrink-0">
              <img
                src={preview}
                alt="Receipt preview"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {isLoading && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <Loader2 className="size-6 animate-spin text-primary" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground truncate">
                {file?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "Extracting data..." : "Ready"}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                reset()
              }}
              aria-label="Remove"
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center gap-2 text-center">
            <Upload className="size-10 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              Drop receipt image or click to upload
            </p>
            <p className="text-xs text-muted-foreground">
              Supports JPG, PNG, WebP
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
