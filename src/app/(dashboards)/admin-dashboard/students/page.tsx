"use client";

import { format, formatDistanceToNow } from "date-fns";
import {
  ChevronDown,
  Filter,
  MoreVertical,
  RefreshCw,
  Search,
  Shield,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppSidebar } from "@/components/dashboard/sidebar";
import { DeleteUserDialog } from "@/components/dashboard/team-members/delete-user-dialog";
import { EditUserDialog } from "@/components/dashboard/team-members/edit-user-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { User } from "@/types/users";

// Format date for display
const formatDate = (dateString?: Date | string | null): string => {
  if (!dateString) return "";
  return format(new Date(dateString), "MMM d, yyyy");
};

// Get time since user was added
const getTimeSince = (dateString?: Date | string | null): string => {
  if (!dateString) return "";
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};

export default function TeamMembersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    admins: true,
    users: true,
  });

  const fetchUsers = async (showToast = false) => {
    try {
      if (showToast) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const response = await fetch("/api/users");
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      setUsers(data);

      if (showToast) {
        toast.success("User data refreshed successfully");
      }
    } catch (error) {
      toast.error("Failed to load users");
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = () => {
    fetchUsers(true);
  };

  // Filter users based on search query, active tab, and filters
  const filterUsers = (users: User[]) => {
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab =
        activeTab === "all" ||
        (activeTab === "admins" && user.role === "ADMIN") ||
        (activeTab === "users" && user.role === "USER");

      const matchesFilters =
        (filters.admins && user.role === "ADMIN") ||
        (filters.users && user.role === "USER");

      return matchesSearch && matchesTab && matchesFilters;
    });
  };

  const filteredUsers = filterUsers(users);

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
                    <RefreshCw
                      className={`h-4 w-4 ${
                        isRefreshing ? "animate-spin" : ""
                      }`}
                    />
                    <span className="sr-only">Refresh</span>
                  </Button>
                </div>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
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
                        {isLoading ? (
                          <Skeleton className="h-8 w-12 bg-gray-200 dark:bg-zinc-800" />
                        ) : (
                          users.length
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/80 dark:bg-zinc-900/70 backdrop-blur-sm border border-gray-200/70 dark:border-zinc-800/70 shadow-md shadow-black/5 dark:shadow-black/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-zinc-400">
                      Admins
                    </CardTitle>
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
              </div>

              {/* Tabs for user types */}
              <Tabs
                defaultValue="all"
                className="w-full"
                onValueChange={(value) => setActiveTab(value)}
              >
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
                        onCheckedChange={(checked) =>
                          setFilters((prev) => ({ ...prev, admins: checked }))
                        }
                      >
                        Admins
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={filters.users}
                        onCheckedChange={(checked) =>
                          setFilters((prev) => ({ ...prev, users: checked }))
                        }
                      >
                        Users
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
  );
}

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  selectedUser: string | null;
  setSelectedUser: (userId: string | null) => void;
}

function UserTable({
  users,
  isLoading,
  selectedUser,
  setSelectedUser,
}: UserTableProps) {
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
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            No members found
          </h3>
          <p className="text-gray-500 dark:text-zinc-400 mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50/70 dark:bg-zinc-800/50">
              <th className="w-12 p-4">
                <Checkbox className="border-gray-300 dark:border-zinc-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600" />
              </th>
              <th className="text-left p-4 font-medium text-sm text-gray-500 dark:text-zinc-400">
                Member
              </th>
              <th className="text-left p-4 font-medium text-sm text-gray-500 dark:text-zinc-400">
                Telephone
              </th>
              <th className="text-left p-4 font-medium text-sm text-gray-500 dark:text-zinc-400">
                Role
              </th>
              <th className="text-left p-4 font-medium text-sm text-gray-500 dark:text-zinc-400">
                Joined
              </th>
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
                    checked={selectedUser === user.id}
                    onCheckedChange={() =>
                      setSelectedUser(user.id === selectedUser ? null : user.id)
                    }
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border-2 border-indigo-500/20 dark:border-indigo-500/20 ring-2 ring-black/5 dark:ring-black/80">
                      <AvatarImage
                        src={user.image || undefined}
                        alt={user.name || "User"}
                      />
                      <AvatarFallback className="bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        {user.name
                          ? user.name.charAt(0).toUpperCase()
                          : user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {user.name || "Unnamed User"}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-zinc-400">
                        {user.email}
                      </div>
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
                      {user.email === "aimahusnain@gmail.com" ? ("SUPER ADMIN") : (user.role === "ADMIN" ? "Admin" : "User")}
                  </Badge>
                </td>
                <td className="p-4 text-sm">
                  <div className="text-gray-700 dark:text-zinc-300">
                    {formatDate(user.createdAt)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-zinc-500">
                    {getTimeSince(user.createdAt)}
                  </div>
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

                        <DeleteUserDialog
                          userId={user.id}
                          userName={user.name || user.email}
                        />
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
  );
}
