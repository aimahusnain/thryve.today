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
import { toast } from "sonner"

interface AddUserDialogProps {
  children: React.ReactNode
  onAddUser?: (userData: { name: string; email: string }) => void
}

export function AddUserDialog({ children, onAddUser }: AddUserDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const handleAddUser = async () => {
    if (!name || !email) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      })

      if (!response.ok) {
        throw new Error("Failed to add user")
      }

      // const newUser = await response.json()
      
      onAddUser?.({ name, email })
      toast.success("User added successfully")
      setOpen(false)
      setName("")
      setEmail("")
    } catch (error) {
      toast.error("Error adding user")
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white border-zinc-800">
        <DialogHeader>
          <DialogTitle>Add new user</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Enter the details of the new user you want to add to the team.
          </DialogDescription>
        </DialogHeader>
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
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleAddUser}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Add User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}