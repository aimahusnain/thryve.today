"use client"

import { useEffect, useState } from "react"
import { toast, Toaster } from "sonner"
import { MoreVertical } from "lucide-react"

import { AppSidebar } from "@/components/dashboard/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DeleteUserDialog } from "@/components/dashboard/team-members/delete-user-dialog"
import { EditUserDialog } from "@/components/dashboard/team-members/edit-user-dialog"
import { AddUserDialog } from "@/components/dashboard/team-members/add-user-dialog"
import { User } from "@/types/users"

export default function TeamMembersPage() {
  const [adminUsers, setAdminUsers] = useState<User[]>([])
  const [accountUsers, setAccountUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)

        // Fetch admin users
        const adminResponse = await fetch("/api/users?role=ADMIN")
        const adminData = await adminResponse.json()

        // Fetch regular users
        const userResponse = await fetch("/api/users?role=USER")
        const userData = await userResponse.json()

        if (!adminResponse.ok || !userResponse.ok) {
          throw new Error("Failed to fetch users")
        }

        setAdminUsers(adminData)
        setAccountUsers(userData)
      } catch (error) {
        toast.error("Failed to load users")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Format date for display
  const formatDate = (dateString?: Date | string | null) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  // Get last active date (using emailVerified as a proxy since we don't have lastActive in the schema)
  const getLastActive = (user: User) => {
    return user.emailVerified ? formatDate(user.emailVerified) : ""
  }

  return (
    <SidebarProvider>
      <Toaster position="top-right" />
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
              <AddUserDialog />
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
                    {isLoading ? (
                      <div className="p-8 text-center">Loading admin users...</div>
                    ) : adminUsers.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">No admin users found</div>
                    ) : (
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
                                    <AvatarImage src={user.image || `https://i.pravatar.cc/124?img=${i + 1}`} />
                                    <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{user.name || "Unnamed User"}</div>
                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-sm">{formatDate(user.createdAt)}</td>
                              <td className="p-4 text-sm">{getLastActive(user)}</td>
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
                                    <EditUserDialog user={user} />
                                    <DeleteUserDialog userId={user.id} userName={user.name || user.email} />
                                    <DropdownMenuItem>Permissions</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
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
                    {isLoading ? (
                      <div className="p-8 text-center">Loading account users...</div>
                    ) : accountUsers.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">No account users found</div>
                    ) : (
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
                          {accountUsers.map((user, i) => (
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
                                    <AvatarImage src={user.image || `https://i.pravatar.cc/124?img=${i + 1}`} />
                                    <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{user.name || "Unnamed User"}</div>
                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-sm">{formatDate(user.createdAt)}</td>
                              <td className="p-4 text-sm">{getLastActive(user)}</td>
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
                                    <EditUserDialog user={user} />
                                    <DeleteUserDialog userId={user.id} userName={user.name || user.email} />
                                    <DropdownMenuItem>Permissions</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
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

