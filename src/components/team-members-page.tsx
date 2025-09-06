"use client"

import type React from "react"

import { format, formatDistanceToNow } from "date-fns"
import {
  Bold,
  ChevronDown,
  Filter,
  Italic,
  Mail,
  MoreVertical,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Underline,
  Users,
  X,
  UserPlus,
  Trash2,
  Paperclip,
} from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { AppSidebar } from "@/components/dashboard/sidebar"
import { DeleteUserDialog } from "@/components/dashboard/delete-user-dialog"
import { EditUserDialog } from "@/components/dashboard/edit-user-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

// Types
interface User {
  id: string
  name?: string | null
  email: string
  image?: string | null
  role: "ADMIN" | "USER"
  telephone?: string | null
  createdAt?: Date | string | null
}

interface EmailGroup {
  id: string
  name: string
  userIds: string[]
  createdAt: Date
}

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
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [emailGroups, setEmailGroups] = useState<EmailGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [filters, setFilters] = useState({
    admins: true,
    users: true,
  })
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false)
  const [isEditGroupDialogOpen, setIsEditGroupDialogOpen] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [emailContent, setEmailContent] = useState("")
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [currentEditingGroup, setCurrentEditingGroup] = useState<EmailGroup | null>(null)
  const [editGroupMembers, setEditGroupMembers] = useState<string[]>([])
  const [editGroupName, setEditGroupName] = useState("")
  const [groupSearchQuery, setGroupSearchQuery] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])

  // Load email groups from localStorage
  useEffect(() => {
    const savedGroups = localStorage.getItem("emailGroups")
    if (savedGroups) {
      try {
        const parsedGroups = JSON.parse(savedGroups)
        setEmailGroups(parsedGroups)
      } catch (error) {
        console.error("Error loading email groups:", error)
      }
    }
  }, [])

  // Save email groups to localStorage
  const saveGroupsToStorage = (groups: EmailGroup[]) => {
    localStorage.setItem("emailGroups", JSON.stringify(groups))
  }

  const fetchUsers = async (showToast = false) => {
    try {
      if (showToast) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }

      const response = await fetch("/api/users")
      const data = await response.json()

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      setUsers(data)

      if (showToast) {
        toast.success("User data refreshed successfully")
      }
    } catch (error) {
      toast.error("Failed to load users")
      console.error(error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRefresh = () => {
    fetchUsers(true)
  }

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

      const matchesFilters = (filters.admins && user.role === "ADMIN") || (filters.users && user.role === "USER")

      return matchesSearch && matchesTab && matchesFilters
    })
  }

  // Filter users for group editing
  const filterUsersForGroup = (users: User[]) => {
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(groupSearchQuery.toLowerCase())
      return matchesSearch
    })
  }

  const filteredUsers = filterUsers(users)
  const filteredUsersForGroup = filterUsersForGroup(users)

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map((user) => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  // Handle individual user selection
  const handleUserSelect = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers((prev) => [...prev, userId])
    } else {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId))
    }
  }

  // Handle group member selection for editing
  const handleGroupMemberSelect = (userId: string, checked: boolean) => {
    if (checked) {
      setEditGroupMembers((prev) => [...prev, userId])
    } else {
      setEditGroupMembers((prev) => prev.filter((id) => id !== userId))
    }
  }

  // Get selected users data
  const getSelectedUsersData = () => {
    return users.filter((user) => selectedUsers.includes(user.id))
  }

  // Create email group
  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      toast.error("Group name is required")
      return
    }

    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user")
      return
    }

    // Check if group name already exists
    if (emailGroups.some((group) => group.name.toLowerCase() === groupName.toLowerCase())) {
      toast.error("Group name already exists")
      return
    }

    const newGroup: EmailGroup = {
      id: Date.now().toString(),
      name: groupName.trim(),
      userIds: [...selectedUsers],
      createdAt: new Date(),
    }

    const updatedGroups = [...emailGroups, newGroup]
    setEmailGroups(updatedGroups)
    saveGroupsToStorage(updatedGroups)

    toast.success(`Group "${groupName}" created with ${selectedUsers.length} members`)
    setGroupName("")
    setIsGroupDialogOpen(false)
  }

  // Open edit group dialog
  const handleOpenEditGroup = (group: EmailGroup) => {
    setCurrentEditingGroup(group)
    setEditGroupName(group.name)
    setEditGroupMembers([...group.userIds])
    setGroupSearchQuery("")
    setIsEditGroupDialogOpen(true)
  }

  // Save edited group
  const handleSaveEditedGroup = () => {
    if (!editGroupName.trim()) {
      toast.error("Group name is required")
      return
    }

    if (editGroupMembers.length === 0) {
      toast.error("Please select at least one user")
      return
    }

    if (!currentEditingGroup) {
      toast.error("No group selected for editing")
      return
    }

    // Check if group name already exists (excluding current group)
    if (
      emailGroups.some(
        (group) => group.id !== currentEditingGroup.id && group.name.toLowerCase() === editGroupName.toLowerCase(),
      )
    ) {
      toast.error("Group name already exists")
      return
    }

    const updatedGroups = emailGroups.map((group) => {
      if (group.id === currentEditingGroup.id) {
        return {
          ...group,
          name: editGroupName.trim(),
          userIds: [...editGroupMembers],
        }
      }
      return group
    })

    setEmailGroups(updatedGroups)
    saveGroupsToStorage(updatedGroups)

    toast.success(`Group "${editGroupName}" updated successfully`)
    setIsEditGroupDialogOpen(false)
    setCurrentEditingGroup(null)
  }

  // Select group
  const handleSelectGroup = (group: EmailGroup) => {
    // Filter out users that no longer exist
    const validUserIds = group.userIds.filter((userId) => users.some((user) => user.id === userId))

    if (validUserIds.length !== group.userIds.length) {
      toast.warning(`Some users from group "${group.name}" no longer exist`)
    }

    setSelectedUsers(validUserIds)
    toast.success(`Selected ${validUserIds.length} users from group "${group.name}"`)
  }

  // Delete group
  const handleDeleteGroup = (groupId: string) => {
    const updatedGroups = emailGroups.filter((group) => group.id !== groupId)
    setEmailGroups(updatedGroups)
    saveGroupsToStorage(updatedGroups)
    toast.success("Group deleted successfully")
  }

  const handleSendEmail = async () => {
    if (!emailSubject.trim() || !emailContent.trim()) {
      toast.error("Please fill in both subject and content")
      return
    }

    setIsSendingEmail(true)
    try {
      const selectedUsersData = getSelectedUsersData()
      const emailAddresses = selectedUsersData.map((user) => user.email)

      console.log(`[v0] Starting batch email send to ${emailAddresses.length} recipients`)

      // Use the new batch API endpoint
      const response = await fetch("/api/send-email-batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailAddresses,
          subject: emailSubject,
          content: emailContent,
          attachments: attachments, // Note: File objects need to be handled differently in batch mode
          batchSize: 3, // Process 3 emails per batch
        }),
      })

      const result = await response.json()

      if (response.ok) {
        const { totalEmailsSent, totalEmailsAttempted, successfulBatches, failedBatches } = result

        if (failedBatches > 0) {
          toast.success(
            `Email sent to ${totalEmailsSent} out of ${totalEmailsAttempted} users. ${failedBatches} batches had issues.`,
          )
        } else {
          toast.success(`Email sent successfully to all ${totalEmailsSent} users in ${successfulBatches} batches!`)
        }

        setIsEmailDialogOpen(false)
        setEmailSubject("")
        setEmailContent("")
        setAttachments([])
        setSelectedUsers([])

        console.log(`[v0] Batch email completed: ${totalEmailsSent}/${totalEmailsAttempted} sent`)
      } else {
        throw new Error(result.error || "Failed to send batch emails")
      }
    } catch (error) {
      console.error("[v0] Batch email error:", error)
      toast.error("Failed to send emails. Please try again.")
    } finally {
      setIsSendingEmail(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setAttachments((prev) => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Rich text editor functions
  const insertFormatting = (format: string) => {
    const textarea = document.getElementById("email-content") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = emailContent.substring(start, end)

    let formattedText = ""
    switch (format) {
      case "bold":
        formattedText = `**${selectedText || "bold text"}**`
        break
      case "italic":
        formattedText = `*${selectedText || "italic text"}*`
        break
      case "underline":
        formattedText = `<u>${selectedText || "underlined text"}</u>`
        break
    }

    const newContent = emailContent.substring(0, start) + formattedText + emailContent.substring(end)
    setEmailContent(newContent)

    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + formattedText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-zinc-900">
          <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Team Members
                  </h1>
                  <p className="text-gray-500 dark:text-zinc-400 mt-1">
                    Manage your team members and their account permissions
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-full md:w-82">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400 dark:text-zinc-500" />
                    <Input
                      placeholder="Search members..."
                      className="pl-9 w-full bg-white/70 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRefresh}
                    disabled={isRefreshing || isLoading}
                    className="h-10 w-10 bg-white/70 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200"
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    <span className="sr-only">Refresh</span>
                  </Button>
                </div>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                <Card className="bg-white/80 dark:bg-zinc-900/70 backdrop-blur-sm border border-gray-200/70 dark:border-zinc-800/70 shadow-md shadow-black/5 dark:shadow-black/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-zinc-400">
                      Total Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-500" />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {isLoading ? <Skeleton className="h-8 w-12 bg-gray-200 dark:bg-zinc-800" /> : users.length}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/80 dark:bg-zinc-900/70 backdrop-blur-sm border border-gray-200/70 dark:border-zinc-800/70 shadow-md shadow-black/5 dark:shadow-black/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-zinc-400">Admins</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-500" />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {isLoading ? (
                          <Skeleton className="h-8 w-12 bg-gray-200 dark:bg-zinc-800" />
                        ) : (
                          users.filter((u) => u.role === "ADMIN").length
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/80 dark:bg-zinc-900/70 backdrop-blur-sm border border-gray-200/70 dark:border-zinc-800/70 shadow-md shadow-black/5 dark:shadow-black/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-zinc-400">Email Groups</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5 text-indigo-600 dark:text-indigo-500" />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{emailGroups.length}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Selected users info and action buttons */}
              {selectedUsers.length > 0 && (
                <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <span className="font-medium text-blue-900 dark:text-blue-100">
                            {selectedUsers.length} user{selectedUsers.length > 1 ? "s" : ""} selected
                          </span>
                        </div>
                        <div className="text-sm text-blue-700 dark:text-blue-300 max-w-md truncate">
                          {getSelectedUsersData()
                            .map((user) => user.name || user.email)
                            .join(", ")}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedUsers([])}
                          className="text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Clear
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsGroupDialogOpen(true)}
                          className="text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/20"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Make a Group
                        </Button>
                        <Button
                          onClick={() => setIsEmailDialogOpen(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Send a New Email
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tabs for user types */}
              <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value)}>
                <div className="flex items-center justify-between mb-4">
                  <TabsList className="bg-gray-100/80 dark:bg-zinc-800/70 border border-gray-200/70 dark:border-zinc-700/50">
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                    >
                      All Members
                    </TabsTrigger>
                    <TabsTrigger
                      value="admins"
                      className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                    >
                      Admins
                    </TabsTrigger>
                    <TabsTrigger
                      value="users"
                      className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                    >
                      Users
                    </TabsTrigger>
                  </TabsList>
                  <div className="flex items-center gap-2">
                    {/* Groups Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300"
                          disabled={emailGroups.length === 0}
                        >
                          <UserPlus className="h-3.5 w-3.5" />
                          <span>Groups ({emailGroups.length})</span>
                          <ChevronDown className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 w-64"
                      >
                        {emailGroups.length === 0 ? (
                          <div className="p-4 text-center text-gray-500 dark:text-zinc-400">
                            <UserPlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No groups created yet</p>
                            <p className="text-xs">Select users and create a group</p>
                          </div>
                        ) : (
                          emailGroups.map((group) => (
                            <div key={group.id}>
                              <DropdownMenuItem
                                className="cursor-pointer flex items-center justify-between p-3"
                                onClick={() => handleSelectGroup(group)}
                              >
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 dark:text-white">{group.name}</div>
                                  <div className="text-xs text-gray-500 dark:text-zinc-400">
                                    {group.userIds.length} members • {formatDate(group.createdAt)}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleOpenEditGroup(group)
                                    }}
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteGroup(group.id)
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </div>
                          ))
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 bg-white/70 dark:bg-zinc-900/70 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-300"
                        >
                          <Filter className="h-3.5 w-3.5" />
                          <span>Filter</span>
                          <ChevronDown className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
                      >
                        <DropdownMenuCheckboxItem
                          checked={filters.admins}
                          onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, admins: checked }))}
                        >
                          Admins
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={filters.users}
                          onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, users: checked }))}
                        >
                          Users
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 bg-white/70 dark:bg-zinc-900/70 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-300"
                      onClick={async () => {
                        let emailList = users
                        if (!users || users.length === 0) {
                          try {
                            const response = await fetch("/api/users")
                            emailList = await response.json()
                          } catch {
                            toast.error("Failed to fetch users for export")
                            return
                          }
                        }
                        const csvRows = [["email", "Consent"], ...emailList.map((u) => [u.email, "true"])]
                        const csvContent = csvRows.map((row) => row.join(",")).join("\r\n")
                        const blob = new Blob([csvContent], { type: "text/csv" })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href = url
                        a.download = "emails.csv"
                        document.body.appendChild(a)
                        a.click()
                        document.body.removeChild(a)
                        URL.revokeObjectURL(url)
                        toast.success("Emails exported!")
                      }}
                    >
                      Export Emails
                    </Button>
                  </div>
                </div>

                <TabsContent value="all">
                  <UserTable
                    users={filteredUsers}
                    isLoading={isLoading}
                    selectedUsers={selectedUsers}
                    onSelectAll={handleSelectAll}
                    onUserSelect={handleUserSelect}
                  />
                </TabsContent>

                <TabsContent value="admins">
                  <UserTable
                    users={filteredUsers}
                    isLoading={isLoading}
                    selectedUsers={selectedUsers}
                    onSelectAll={handleSelectAll}
                    onUserSelect={handleUserSelect}
                  />
                </TabsContent>

                <TabsContent value="users">
                  <UserTable
                    users={filteredUsers}
                    isLoading={isLoading}
                    selectedUsers={selectedUsers}
                    onSelectAll={handleSelectAll}
                    onUserSelect={handleUserSelect}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>

        {/* Create Group Dialog */}
        <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Create Email Group
              </DialogTitle>
              <DialogDescription>
                Create a group with {selectedUsers.length} selected user{selectedUsers.length > 1 ? "s" : ""} for easy
                email sending.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="group-name">Group Name</Label>
                <Input
                  id="group-name"
                  placeholder="Enter group name..."
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCreateGroup()
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Selected Members ({selectedUsers.length})</Label>
                <div className="max-h-32 overflow-y-auto p-2 bg-gray-50 dark:bg-zinc-800/50 rounded border text-sm">
                  {getSelectedUsersData().map((user, index) => (
                    <div key={user.id} className="flex items-center gap-2 py-1">
                      <span className="text-gray-600 dark:text-zinc-400">{index + 1}.</span>
                      <span>{user.name || user.email}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsGroupDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateGroup} disabled={!groupName.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Group Dialog */}
        <Dialog open={isEditGroupDialogOpen} onOpenChange={setIsEditGroupDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Pencil className="h-5 w-5" />
                Edit Email Group
              </DialogTitle>
              <DialogDescription>
                Edit group name and members for {currentEditingGroup?.name || "selected group"}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-group-name">Group Name</Label>
                <Input
                  id="edit-group-name"
                  placeholder="Enter group name..."
                  value={editGroupName}
                  onChange={(e) => setEditGroupName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Group Members ({editGroupMembers.length})</Label>
                  <div className="relative w-[200px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400 dark:text-zinc-500" />
                    <Input
                      placeholder="Search members..."
                      className="pl-9 w-full"
                      value={groupSearchQuery}
                      onChange={(e) => setGroupSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="border rounded-md max-h-64 overflow-y-auto">
                  <div className="p-2 border-b bg-gray-50 dark:bg-zinc-800/50 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Select Members</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => {
                        if (editGroupMembers.length === users.length) {
                          setEditGroupMembers([])
                        } else {
                          setEditGroupMembers(users.map((user) => user.id))
                        }
                      }}
                    >
                      {editGroupMembers.length === users.length ? "Deselect All" : "Select All"}
                    </Button>
                  </div>
                  <div className="p-2 space-y-2">
                    {filteredUsersForGroup.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center space-x-2 py-1 px-1 hover:bg-gray-50 dark:hover:bg-zinc-800/50 rounded"
                      >
                        <Checkbox
                          id={`user-${user.id}`}
                          checked={editGroupMembers.includes(user.id)}
                          onCheckedChange={(checked) => handleGroupMemberSelect(user.id, checked as boolean)}
                          className="border-gray-300 dark:border-zinc-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                        />
                        <div className="flex items-center gap-2 flex-1">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                            <AvatarFallback className="text-xs bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <Label
                            htmlFor={`user-${user.id}`}
                            className="text-sm font-normal cursor-pointer flex-1 flex flex-col"
                          >
                            <span className="text-gray-900 dark:text-white">{user.name || "Unnamed User"}</span>
                            <span className="text-xs text-gray-500 dark:text-zinc-400">{user.email}</span>
                          </Label>
                          <Badge
                            variant={user.role === "ADMIN" ? "default" : "secondary"}
                            className="ml-auto text-xs h-5 px-1.5"
                          >
                            {user.role}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {filteredUsersForGroup.length === 0 && (
                      <div className="py-8 text-center text-gray-500 dark:text-zinc-400">
                        <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No users found</p>
                        <p className="text-xs">Try adjusting your search</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditGroupDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEditedGroup} disabled={!editGroupName.trim() || editGroupMembers.length === 0}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Email Dialog */}
        <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Send Email to Selected Users
              </DialogTitle>
              <DialogDescription>
                Sending email to {selectedUsers.length} selected user{selectedUsers.length > 1 ? "s" : ""}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email-subject">Subject</Label>
                <Input
                  id="email-subject"
                  placeholder="Enter email subject..."
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-content">Message</Label>
                <div className="border rounded-md">
                  <div className="flex items-center gap-1 p-2 border-b bg-gray-50 dark:bg-zinc-800/50">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting("bold")}
                      className="h-8 w-8 p-0"
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting("italic")}
                      className="h-8 w-8 p-0"
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting("underline")}
                      className="h-8 w-8 p-0"
                    >
                      <Underline className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    id="email-content"
                    placeholder="Write your email message here..."
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    className="min-h-[200px] border-0 focus-visible:ring-0 resize-none"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  Use **bold**, *italic*, and {"<u>underline</u>"} for formatting
                </p>
              </div>

              <div className="space-y-2">
                <Label>Attachments</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input type="file" multiple onChange={handleFileSelect} className="hidden" id="file-upload" />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("file-upload")?.click()}
                      className="flex items-center gap-2"
                    >
                      <Paperclip className="h-4 w-4" />
                      Add Files
                    </Button>
                    <span className="text-xs text-gray-500">Max 25MB total</span>
                  </div>

                  {attachments.length > 0 && (
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-zinc-800/50 rounded border text-sm"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Paperclip className="h-3 w-3 text-gray-500 flex-shrink-0" />
                            <span className="truncate">{file.name}</span>
                            <span className="text-gray-500 text-xs flex-shrink-0">({formatFileSize(file.size)})</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(index)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <div className="text-xs text-gray-500 pt-1">
                        Total: {formatFileSize(attachments.reduce((sum, file) => sum + file.size, 0))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Recipients ({selectedUsers.length})</Label>
                <div className="max-h-24 overflow-y-auto p-2 bg-gray-50 dark:bg-zinc-800/50 rounded border text-sm">
                  {getSelectedUsersData().map((user, index) => (
                    <div key={user.id} className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-zinc-400">{index + 1}.</span>
                      <span>{user.name || user.email}</span>
                      <span className="text-gray-500 dark:text-zinc-500">({user.email})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)} disabled={isSendingEmail}>
                Cancel
              </Button>
              <Button
                onClick={handleSendEmail}
                disabled={isSendingEmail || !emailSubject.trim() || !emailContent.trim()}
              >
                {isSendingEmail ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email {attachments.length > 0 && `(${attachments.length} files)`}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  )
}

interface UserTableProps {
  users: User[]
  isLoading: boolean
  selectedUsers: string[]
  onSelectAll: (checked: boolean) => void
  onUserSelect: (userId: string, checked: boolean) => void
}

function UserTable({ users, isLoading, selectedUsers, onSelectAll, onUserSelect }: UserTableProps) {
  const isAllSelected = users.length > 0 && selectedUsers.length === users.length
  const isIndeterminate = selectedUsers.length > 0 && selectedUsers.length < users.length

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-lg shadow-black/5 dark:shadow-black/20 overflow-hidden">
      {isLoading ? (
        <div className="p-8 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full bg-gray-200 dark:bg-zinc-800" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px] bg-gray-200 dark:bg-zinc-800" />
                <Skeleton className="h-4 w-[200px] bg-gray-200 dark:bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
            <Users className="h-6 w-6 text-gray-400 dark:text-zinc-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No members found</h3>
          <p className="text-gray-500 dark:text-zinc-400 mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50/70 dark:bg-zinc-800/50">
              <th className="w-12 p-4">
                <Checkbox
                  className="border-gray-300 dark:border-zinc-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) (el as HTMLInputElement).indeterminate = isIndeterminate
                  }}
                  onCheckedChange={onSelectAll}
                />
              </th>
              <th className="text-left p-4 font-medium text-sm text-gray-500 dark:text-zinc-400">Member</th>
              <th className="text-left p-4 font-medium text-sm text-gray-500 dark:text-zinc-400">Telephone</th>
              <th className="text-left p-4 font-medium text-sm text-gray-500 dark:text-zinc-400">Role</th>
              <th className="text-left p-4 font-medium text-sm text-gray-500 dark:text-zinc-400">Joined</th>
              <th className="w-12 p-4"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-200 dark:border-zinc-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <td className="p-4">
                  <Checkbox
                    className="border-gray-300 dark:border-zinc-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={(checked) => onUserSelect(user.id, checked as boolean)}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border-2 border-indigo-500/20 dark:border-indigo-500/20 ring-2 ring-black/5 dark:ring-black/80">
                      <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                      <AvatarFallback className="bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{user.name || "Unnamed User"}</div>
                      <div className="text-sm text-gray-500 dark:text-zinc-400">{user.email}</div>
                    </div>
                  </div>
                </td>

                <td className="p-4 text-sm">{user.telephone}</td>

                <td className="p-4">
                  <Badge
                    variant={user.role === "ADMIN" ? "default" : "secondary"}
                    className={
                      user.role === "ADMIN"
                        ? "font-normal bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-500/30 border-indigo-200 dark:border-indigo-500/30"
                        : "font-normal bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700 border-gray-200 dark:border-zinc-700"
                    }
                  >
                    {user.email === "aimahusnain@gmail.com" ? "SUPER ADMIN" : user.role === "ADMIN" ? "Admin" : "User"}
                  </Badge>
                </td>
                <td className="p-4 text-sm">
                  <div className="text-gray-700 dark:text-zinc-300">{formatDate(user.createdAt)}</div>
                  <div className="text-xs text-gray-500 dark:text-zinc-500">{getTimeSince(user.createdAt)}</div>
                </td>
                <td className="p-4">
                  {user.email === "aimahusnain@gmail.com" ? (
                    ""
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
                        >
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
                      >
                        <EditUserDialog user={user} />
                        <DeleteUserDialog userId={user.id} userName={user.name || user.email} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
