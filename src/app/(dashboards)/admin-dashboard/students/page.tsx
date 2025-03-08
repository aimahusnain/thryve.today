"use client"

import { useEffect, useState } from "react"
import { toast, Toaster } from "sonner"
import { MoreVertical, Search, UserPlus, Filter, ChevronDown, CheckCircle2, Clock, Shield, Users } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"

import { AppSidebar } from "@/components/dashboard/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DeleteUserDialog } from "@/components/dashboard/team-members/delete-user-dialog"
import { EditUserDialog } from "@/components/dashboard/team-members/edit-user-dialog"
import { AddUserDialog } from "@/components/dashboard/team-members/add-user-dialog"
import type { User } from "@/types/users"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Format date for display
const formatDate = (dateString?: Date | string | null): string => {
  if (!dateString) return ""
  return format(new Date(dateString), "MMM d, yyyy")
}

// Get time since user was added
const getTimeSince = (dateString?: Date | string | null): string => {
  if (!dateString) return ""
  return formatDistanceToNow(new Date(dateString), { addSuffix: true })
}

export default function TeamMembersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [filters, setFilters] = useState({
    active: true,
    pending: true,
  })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/users")
        const data = await response.json()

        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }

        setUsers(data)
      } catch (error) {
        toast.error("Failed to load users")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Filter users based on search query, active tab, and filters
  const filterUsers = (users: User[]) => {
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesTab =
        activeTab === "all" ||
        (activeTab === "admins" && user.role === "ADMIN") ||
        (activeTab === "users" && user.role === "USER")

      const matchesFilters = (filters.active && user.emailVerified) || (filters.pending && !user.emailVerified)

      return matchesSearch && matchesTab && matchesFilters
    })
  }

  const filteredUsers = filterUsers(users)

  // Get user status badge
  const getUserStatusBadge = (user: User) => {
    if (user.emailVerified) {
      return (
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
          Active
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-amber-500/10 text-amber-300 border-amber-500/30">
        Pending
      </Badge>
    )
  }

  return (
    <SidebarProvider>
      <Toaster position="top-right" />
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-black to-zinc-900 dark:from-black dark:to-zinc-900">
          <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white dark:text-white">
                    Team Members
                  </h1>
                  <p className="text-zinc-400 dark:text-zinc-400 mt-1">
                    Manage your team members and their account permissions
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                    <Input
                      placeholder="Search members..."
                      className="pl-9 w-full bg-zinc-900/50 dark:bg-zinc-800/50 border-zinc-800 dark:border-zinc-700 text-white placeholder:text-zinc-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <AddUserDialog>
                    <Button className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white">
                      <UserPlus className="h-4 w-4" />
                      <span className="hidden md:inline">Add Member</span>
                    </Button>
                  </AddUserDialog>
                </div>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-zinc-900/70 dark:bg-zinc-900/70 backdrop-blur-sm border border-zinc-800/70 dark:border-zinc-800/70 shadow-lg shadow-black/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400 dark:text-zinc-400">
                      Total Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                      <div className="text-2xl font-bold text-white dark:text-white">
                        {isLoading ? <Skeleton className="h-8 w-12 bg-zinc-800" /> : users.length}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-zinc-900/70 dark:bg-zinc-900/70 backdrop-blur-sm border border-zinc-800/70 dark:border-zinc-800/70 shadow-lg shadow-black/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400 dark:text-zinc-400">Admins</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                      <div className="text-2xl font-bold text-white dark:text-white">
                        {isLoading ? (
                          <Skeleton className="h-8 w-12 bg-zinc-800" />
                        ) : (
                          users.filter((u) => u.role === "ADMIN").length
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-zinc-900/70 dark:bg-zinc-900/70 backdrop-blur-sm border border-zinc-800/70 dark:border-zinc-800/70 shadow-lg shadow-black/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400 dark:text-zinc-400">Active Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                      <div className="text-2xl font-bold text-white dark:text-white">
                        {isLoading ? (
                          <Skeleton className="h-8 w-12 bg-zinc-800" />
                        ) : (
                          users.filter((u) => u.emailVerified).length
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-zinc-900/70 dark:bg-zinc-900/70 backdrop-blur-sm border border-zinc-800/70 dark:border-zinc-800/70 shadow-lg shadow-black/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400 dark:text-zinc-400">Pending</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                      <div className="text-2xl font-bold text-white dark:text-white">
                        {isLoading ? (
                          <Skeleton className="h-8 w-12 bg-zinc-800" />
                        ) : (
                          users.filter((u) => !u.emailVerified).length
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs for user types */}
              <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value)}>
                <div className="flex items-center justify-between mb-4">
                  <TabsList className="bg-zinc-800/70 dark:bg-zinc-800/70 border border-zinc-700/50 dark:border-zinc-700/50">
                    <TabsTrigger value="all" className="data-[state=active]:bg-zinc-900 data-[state=active]:text-white">
                      All Members
                    </TabsTrigger>
                    <TabsTrigger
                      value="admins"
                      className="data-[state=active]:bg-zinc-900 data-[state=active]:text-white"
                    >
                      Admins
                    </TabsTrigger>
                    <TabsTrigger
                      value="users"
                      className="data-[state=active]:bg-zinc-900 data-[state=active]:text-white"
                    >
                      Users
                    </TabsTrigger>
                  </TabsList>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 bg-zinc-900/70 border-zinc-700 hover:bg-zinc-800 text-zinc-300"
                      >
                        <Filter className="h-3.5 w-3.5" />
                        <span>Filter</span>
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                      <DropdownMenuCheckboxItem
                        checked={filters.active}
                        onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, active: checked }))}
                      >
                        Active Users
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={filters.pending}
                        onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, pending: checked }))}
                      >
                        Pending Users
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <TabsContent value="all">
                  <UserTable
                    users={filteredUsers}
                    isLoading={isLoading}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                  />
                </TabsContent>

                <TabsContent value="admins">
                  <UserTable
                    users={filteredUsers}
                    isLoading={isLoading}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                  />
                </TabsContent>

                <TabsContent value="users">
                  <UserTable
                    users={filteredUsers}
                    isLoading={isLoading}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

interface UserTableProps {
  users: User[]
  isLoading: boolean
  selectedUser: string | null
  setSelectedUser: (userId: string | null) => void
}

function UserTable({ users, isLoading, selectedUser, setSelectedUser }: UserTableProps) {
  return (
    <div className="bg-zinc-900 dark:bg-zinc-900 rounded-lg border border-zinc-800 dark:border-zinc-800 shadow-xl shadow-black/20 overflow-hidden">
      {isLoading ? (
        <div className="p-8 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full bg-zinc-800" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px] bg-zinc-800" />
                <Skeleton className="h-4 w-[200px] bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-zinc-800 dark:bg-zinc-800 flex items-center justify-center mb-3">
            <Users className="h-6 w-6 text-zinc-500" />
          </div>
          <h3 className="text-lg font-medium text-white">No members found</h3>
          <p className="text-zinc-400 mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-800/50 dark:bg-zinc-800/50">
              <th className="w-12 p-4">
                <Checkbox className="border-zinc-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600" />
              </th>
              <th className="text-left p-4 font-medium text-sm text-zinc-400">Member</th>
              <th className="text-left p-4 font-medium text-sm text-zinc-400">Role</th>
              <th className="text-left p-4 font-medium text-sm text-zinc-400">Status</th>
              <th className="text-left p-4 font-medium text-sm text-zinc-400">Joined</th>
              <th className="w-12 p-4"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr
                key={user.id}
                className="border-b border-zinc-800 last:border-b-0 hover:bg-zinc-800/50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <td className="p-4">
                  <Checkbox
                    className="border-zinc-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                    checked={selectedUser === user.id}
                    onCheckedChange={() => setSelectedUser(user.id === selectedUser ? null : user.id)}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border-2 border-indigo-500/20 dark:border-indigo-500/20 ring-2 ring-black/80">
                      <AvatarImage src={user.image || `https://i.pravatar.cc/124?img=${i + 1}`} />
                      <AvatarFallback className="bg-indigo-500/10 text-indigo-400 dark:bg-indigo-500/20">
                        {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-white">{user.name || "Unnamed User"}</div>
                      <div className="text-sm text-zinc-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <Badge
                    variant={user.role === "ADMIN" ? "default" : "secondary"}
                    className={
                      user.role === "ADMIN"
                        ? "font-normal bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-indigo-500/30"
                        : "font-normal bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-zinc-700"
                    }
                  >
                    {user.role === "ADMIN" ? "Admin" : "User"}
                  </Badge>
                </td>
                <td className="p-4">
                  {user.emailVerified ? (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-300 border-amber-500/30">
                      Pending
                    </Badge>
                  )}
                </td>
                <td className="p-4 text-sm">
                  <div className="text-zinc-300">{formatDate(user.createdAt)}</div>
                  <div className="text-xs text-zinc-500">{getTimeSince(user.createdAt)}</div>
                </td>
                <td className="p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                      <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 focus:text-white">
                        View profile
                      </DropdownMenuItem>
                      <EditUserDialog user={user} />
                      <DeleteUserDialog userId={user.id} userName={user.name || user.email} />
                      <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 focus:text-white">
                        Permissions
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}