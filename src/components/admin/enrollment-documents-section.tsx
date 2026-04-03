"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { format } from "date-fns"
import { Download, FileImage, Loader2, Trash2, Upload } from "lucide-react"
import { toast } from "sonner"

const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png"] as const
const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"] as const

type Doc = {
  id: string
  originalFileName: string
  mimeType: string | null
  sizeBytes: number | null
  createdAt: string
}

export function EnrollmentDocumentsSection({ enrollmentId }: { enrollmentId: string }) {
  const [documents, setDocuments] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null)

  const isAllowedImageFile = (file: File) => {
    const name = file.name.toLowerCase()
    const hasAllowedExt = ALLOWED_IMAGE_EXTENSIONS.some((ext) => name.endsWith(ext))
    const hasAllowedMime = ALLOWED_IMAGE_MIME_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number])
    return hasAllowedExt && hasAllowedMime
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/enrollments/${enrollmentId}/documents`, {
        credentials: "include",
      })
      if (!res.ok) {
        throw new Error("Failed to load documents")
      }
      const data = await res.json()
      setDocuments(data.documents ?? [])
    } catch {
      toast.error("Could not load scanned documents")
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }, [enrollmentId])

  useEffect(() => {
    void load()
  }, [load])

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files
    if (!list?.length) return
    setUploading(true)
    try {
      const formData = new FormData()
      let added = 0
      for (let i = 0; i < list.length; i++) {
        const file = list[i]
        if (!isAllowedImageFile(file)) continue
        formData.append("files", file)
        added++
      }

      if (added === 0) {
        toast.error("Only JPG and PNG images are allowed.")
        return
      }

      if (added < list.length) {
        toast.message("Some files were skipped", {
          description: "Only JPG and PNG images were uploaded.",
        })
      }
      const res = await fetch(`/api/admin/enrollments/${enrollmentId}/documents`, {
        method: "POST",
        body: formData,
        credentials: "include",
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Upload failed")
      }
      toast.success("Documents uploaded")
      await load()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/enrollments/${enrollmentId}/documents/${deleteId}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Delete failed")
      toast.success("Document removed")
      setDeleteId(null)
      await load()
    } catch {
      toast.error("Could not delete document")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <div className="flex items-center gap-2">
          <Input
            id={`scan-upload-${enrollmentId}`}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            className="hidden"
            disabled={uploading}
            onChange={handleFiles}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={uploading}
            onClick={() => document.getElementById(`scan-upload-${enrollmentId}`)?.click()}
          >
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            Upload
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading documents…</p>
      ) : documents.length === 0 ? (
        <p className="text-sm text-muted-foreground">No documents yet. Upload JPG or PNG images.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {documents.map((doc) => {
              const fileUrl = `/api/admin/enrollments/${enrollmentId}/documents/${doc.id}/file`
              const isImage = doc.mimeType?.startsWith("image/")
              return (
                <div
                  key={doc.id}
                  className="group relative rounded-md border bg-background p-2"
                >
                  <button
                    type="button"
                    className="w-full text-left"
                    disabled={!isImage}
                    onClick={() => {
                      if (!isImage) return
                      setSelectedDoc(doc)
                    }}
                    title={isImage ? "Click to expand" : "Preview not available"}
                  >
                    {isImage ? (
                      <img
                        src={fileUrl}
                        alt={doc.originalFileName}
                        loading="lazy"
                        className="aspect-[4/3] w-full rounded-sm object-cover"
                      />
                    ) : (
                      <div className="aspect-[4/3] w-full rounded-sm bg-muted/30 flex items-center justify-center">
                        <FileImage className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </button>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="min-w-0 flex-1 truncate text-xs font-medium text-muted-foreground">
                      {doc.originalFileName}
                    </p>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" asChild>
                        <a href={fileUrl} download title="Download">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                        type="button"
                        onClick={() => setDeleteId(doc.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>

                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {format(new Date(doc.createdAt), "MMM d, yyyy h:mm a")}
                    {doc.sizeBytes != null ? ` · ${(doc.sizeBytes / 1024).toFixed(1)} KB` : ""}
                  </p>
                </div>
              )
            })}
          </div>
        </>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this document?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the file from storage and the database. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                void confirmDelete()
              }}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={selectedDoc !== null} onOpenChange={(open) => !open && setSelectedDoc(null)}>
        <DialogContent className="max-w-5xl p-4">
          <DialogHeader>
            <DialogTitle className="truncate text-base">{selectedDoc?.originalFileName}</DialogTitle>
          </DialogHeader>

          {selectedDoc && selectedDoc.mimeType?.startsWith("image/") ? (
            <div className="flex flex-col items-center gap-3">
              <img
                src={`/api/admin/enrollments/${enrollmentId}/documents/${selectedDoc.id}/file`}
                alt={selectedDoc.originalFileName}
                className="max-h-[70vh] w-auto rounded-sm object-contain"
              />

              <div className="flex w-full justify-end gap-2">
                <Button variant="outline" asChild>
                  <a
                    href={`/api/admin/enrollments/${enrollmentId}/documents/${selectedDoc.id}/file`}
                    download
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Preview not available for this file.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
