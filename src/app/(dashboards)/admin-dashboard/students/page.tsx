"use client"

import { MoreVertical, Plus } from "lucide-react"
import { useState } from "react"

import { AppSidebar } from "@/components/dashboard/sidebar"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AvatarFallback } from "@radix-ui/react-avatar"

interface User {
  id: string
  name: string
  email: string
  dateAdded: string
  lastActive: string
  avatar: string
}

export default function TeamMembersPage() {
  const [adminUsers, setAdminUsers] = useState<User[]>([
    {
      id: "1",
      name: "Olivia Rhye",
      email: "olivia@untitleui.com",
      dateAdded: "Feb 22, 2022",
      lastActive: "Mar 14, 2022",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "Phoenix Baker",
      email: "phoenix@untitleui.com",
      dateAdded: "Feb 22, 2022",
      lastActive: "Mar 12, 2022",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      name: "Lana Steiner",
      email: "lana@untitleui.com",
      dateAdded: "Feb 22, 2022",
      lastActive: "",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "4",
      name: "Demi Wilkinson",
      email: "demi@untitleui.com",
      dateAdded: "Feb 22, 2022",
      lastActive: "",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "5",
      name: "Candice Wu",
      email: "candice@untitleui.com",
      dateAdded: "Feb 22, 2022",
      lastActive: "Mar 13, 2022",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ])

  const [accountUsers, setAccountUsers] = useState<User[]>([
    {
      id: "6",
      name: "Natali Craig",
      email: "natali@untitleui.com",
      dateAdded: "Feb 22, 2022",
      lastActive: "Mar 14, 2022",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ])

  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex pr-[50px] flex-col min-h-screen">
          <main className="flex-1 p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold">Team members</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your team members and their account permissions here.
                </p>
              </div>
              <Button className="flex bg-white border-zinc-300 border-2 text-black items-center gap-1">
                <Plus className="h-4 w-4" />
                Add team member
              </Button>
            </div>

            <div className="space-y-8">
              {/* Admin Users Section - Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Left Column - Title and Description */}
                <div className="md:col-span-1 ">
                  <h2 className="text-base font-semibold">Admin users</h2>
                  <p className="text-sm text-muted-foreground mt-auto">
                    Admins can add and remove users and manage organization-level settings.
                  </p>
                </div>

                {/* Right Column - Data Table */}
                <div className="md:col-span-3">
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/30">
                          <th className="w-12 p-4">
                            <Checkbox />
                          </th>
                          <th className="text-left p-4 font-medium text-sm">Name</th>
                          <th className="text-left p-4 font-medium text-sm">Date added</th>
                          <th className="text-left p-4 font-medium text-sm">Last active</th>
                          <th className="w-12 p-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminUsers.map((user, i) => (
                          <tr key={user.id} className="border-b last:border-b-0">
                            <td className="p-4">
                              <Checkbox
                                checked={selectedUser === user.id}
                                onCheckedChange={() => setSelectedUser(user.id === selectedUser ? null : user.id)}
                              />
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-primary/20 dark:border-[#2db188]/20">
                      <AvatarImage
                        src={`https://i.pravatar.cc/124?img=${i + 1}`}
                      />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-sm text-muted-foreground">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-sm">{user.dateAdded}</td>
                            <td className="p-4 text-sm">{user.lastActive}</td>
                            <td className="p-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View profile</DropdownMenuItem>
                                  <DropdownMenuItem>Delete</DropdownMenuItem>
                                  <DropdownMenuItem>Archive</DropdownMenuItem>
                                  <DropdownMenuItem>Permissions</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Account Users Section - Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Left Column - Title and Description */}
                <div className="md:col-span-1 ">
                  <h2 className="text-base font-semibold">Account users</h2>
                  <p className="text-sm text-muted-foreground mt-auto">
                    Account users can access and review risks, questionnaires, and identify breaches.
                  </p>
                </div>

                {/* Right Column - Data Table */}
                <div className="md:col-span-3">
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/30">
                          <th className="w-12 p-4">
                            <Checkbox />
                          </th>
                          <th className="text-left p-4 font-medium text-sm">Name</th>
                          <th className="text-left p-4 font-medium text-sm">Date added</th>
                          <th className="text-left p-4 font-medium text-sm">Last active</th>
                          <th className="w-12 p-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {accountUsers.map((user) => (
                          <tr key={user.id} className="border-b last:border-b-0">
                            <td className="p-4">
                              <Checkbox
                                checked={selectedUser === user.id}
                                onCheckedChange={() => setSelectedUser(user.id === selectedUser ? null : user.id)}
                              />
                            </td>
                            <td className="p-4">
                              <div className="flex  items-center gap-3">
                                <img
                                  src={user.avatar || "/placeholder.svg"}
                                  alt={user.name}
                                  className="h-10  w-10 rounded-full"
                                />
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-sm text-muted-foreground">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-sm">{user.dateAdded}</td>
                            <td className="p-4 text-sm">{user.lastActive}</td>
                            <td className="p-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View profile</DropdownMenuItem>
                                  <DropdownMenuItem>Delete</DropdownMenuItem>
                                  <DropdownMenuItem>Archive</DropdownMenuItem>
                                  <DropdownMenuItem>Permissions</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

