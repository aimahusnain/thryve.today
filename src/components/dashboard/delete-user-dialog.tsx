"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

interface DeleteUserDialogProps {
  userId: string
  userName: string
}

export function DeleteUserDialog({ userId, userName }: DeleteUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/users/delete/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("User deleted successfully")
        setIsOpen(false)
        // Refresh the page or update the users list
        window.location.reload()
      } else {
        throw new Error("Failed to delete user")
      }
    } catch (error) {
      toast.error("Failed to delete user")
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 cursor-pointer"
          onSelect={(e) => {
            e.preventDefault()
            setIsOpen(true)
          }}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete User
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {userName}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
