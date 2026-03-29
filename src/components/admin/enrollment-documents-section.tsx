"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Download, Loader2, Trash2, Upload } from "lucide-react"
import { toast } from "sonner"

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
      for (let i = 0; i < list.length; i++) {
        formData.append("files", list[i])
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
            accept=".pdf,.jpg,.jpeg,.png,.webp,.tif,.tiff"
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
        <p className="text-sm text-muted-foreground">No scanned documents yet. Upload PDF or image files.</p>
      ) : (
        <ul className="divide-y rounded-md border bg-background text-sm">
          {documents.map((doc) => (
            <li key={doc.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{doc.originalFileName}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(doc.createdAt), "MMM d, yyyy h:mm a")}
                  {doc.sizeBytes != null ? ` · ${(doc.sizeBytes / 1024).toFixed(1)} KB` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                  <a
                    href={`/api/admin/enrollments/${enrollmentId}/documents/${doc.id}/file`}
                    download
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                  type="button"
                  onClick={() => setDeleteId(doc.id)}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </li>
          ))}
        </ul>
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
    </div>
  )
}
