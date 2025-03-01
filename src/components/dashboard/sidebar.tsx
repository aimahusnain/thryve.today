"use client";

import type * as React from "react";
import { signOut, useSession } from "next-auth/react";
import {
  BarChart3,
  ClipboardList,
  Command,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Moon,
  Settings,
  ShoppingCart,
  Sun,
  Wallet,
} from "lucide-react";
import { useTheme } from "next-themes";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { HelpSupportDialog } from "./help-support-dialog";

const navItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/dashboard",
    isActive: true,
  },
  { title: "Forms", icon: ClipboardList, url: "/forms" },
  { title: "Orders", icon: ShoppingCart, url: "/orders" },
  { title: "Students", icon: GraduationCap, url: "/students" },
  { title: "Courses", icon: BarChart3, url: "/courses" },
  { title: "Payout", icon: Wallet, url: "/payout" },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/10 bg-primary/10 backdrop-blur supports-[backdrop-filter]:bg-primary/5"
      {...props}
    >
      {/* User Profile Section */}
      {session && session.user && (
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary">
                    <Avatar>
                      <AvatarImage
                        src={session.user.image || "/placeholder.svg"}
                        alt={session.user.name || "User"}
                      />
                      <AvatarFallback>
                        {session.user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>{" "}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {session.user.name}
                    </span>
                    <span className="truncate text-xs">
                      {session.user.email}
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        // <div className="flex items-center gap-3 p-4">
        //   <Avatar>
        //     <AvatarImage src={session.user.image || "/placeholder.svg"} alt={session.user.name || "User"} />
        //     <AvatarFallback>{session.user.name?.charAt(0) || "U"}</AvatarFallback>
        //   </Avatar>
        //   <div>
        //     <p className="font-semibold">{session.user.name}</p>
        //     <p className="text-sm text-muted-foreground">{session.user.email}</p>
        //   </div>
        // </div>
      )}

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={item.isActive}
                  tooltip={item.title}
                  className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    item.isActive
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  <Link href={item.url} className="flex w-full items-center">
                    <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                    <span className="ml-3 sidebar-expanded-only">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto">
        <SidebarSeparator className="mb-4 opacity-50" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Settings"
              className="group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
            >
              <Link href="/settings" className="flex w-full items-center">
                <Settings className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="ml-3 sidebar-expanded-only">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Help & Support"
              className="group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
            >
              <HelpSupportDialog />
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Toggle theme"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="group flex cursor-pointer w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
            >
              <div className="flex w-full items-center">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="ml-3 sidebar-expanded-only">Toggle theme</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Logout"
              onClick={handleLogout}
              className="group flex w-full items-center rounded-lg px-3 mb-2 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
            >
              <div className="flex w-full items-center">
                <LogOut className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="ml-3 sidebar-expanded-only">Logout</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail className="bg-muted/20" />
    </Sidebar>
  );
}
