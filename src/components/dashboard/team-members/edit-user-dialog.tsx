"use client"

import type React from "react"
import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import type { User } from "@/types/users"
import { toast } from "sonner"

interface EditUserDialogProps {
  user: User
}

export function EditUserDialog({ user }: EditUserDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(user.name || "")
  const [email, setEmail] = useState(user.email)
  const [role, setRole] = useState<"ADMIN" | "USER">(user.role)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, role }),
      })

      if (!response.ok) {
        throw new Error("Failed to update user")
      }

      toast.success("User updated successfully")
      setOpen(false)
    } catch (error) {
      toast.error("Error updating user")
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="text-zinc-300 focus:bg-zinc-800 focus:text-white"
        >
          Edit user
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white border-zinc-800">
        <DialogHeader>
          <DialogTitle>Edit team member</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Make changes to the user's profile here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select value={role} onValueChange={(value: "ADMIN" | "USER") => setRole(value)}>
                <SelectTrigger className="col-span-3 bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}