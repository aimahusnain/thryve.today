"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/dashboard/sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Download, Filter, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar"; // ShadCN Calendar ka component
import { format } from "date-fns";

// Sample data based on the image
const orders = [
  {
    id: "#CS238376",
    name: "Vest Hoodie",
    date: "Apr 24, 2022",
    customer: "Chieko Chute",
    payment: "Paid",
    status: "Unfulfilled",
    price: "$450.00",
  },
  {
    id: "#CS238401",
    name: "Sweatshirt With Hood",
    date: "May 10, 2022",
    customer: "Jacob Jones",
    payment: "Unpaid",
    status: "Unfulfilled",
    price: "$450.00",
  },
  {
    id: "#CS238742",
    name: "Oxford Shirt",
    date: "May 28, 2022",
    customer: "Darlene Robertson",
    payment: "Paid",
    status: "Shipping",
    price: "$450.00",
  },
  {
    id: "#CS235978",
    name: "Vest Hoodie",
    date: "Jun 02, 2022",
    customer: "Brooklyn Simmons",
    payment: "Unpaid",
    status: "Unfulfilled",
    price: "$450.00",
  },
  {
    id: "#CS236371",
    name: "Metallic Layer Shirt",
    date: "Jun 22, 2022",
    customer: "Jerome Bell",
    payment: "Unpaid",
    status: "Unfulfilled",
    price: "$450.00",
  },
  {
    id: "#CS238642",
    name: "Oxford Shirt",
    date: "Jul 13, 2022",
    customer: "Wade Warren",
    payment: "Paid",
    status: "Shipping",
    price: "$450.00",
  },
  {
    id: "#CS242731",
    name: "Sweatshirt With Hood",
    date: "Jul 24, 2022",
    customer: "Esther Howard",
    payment: "Paid",
    status: "Shipping",
    price: "$450.00",
  },
]

export default function OrdersDashboard() {
  const [currentPage, setCurrentPage] = useState(1)
  // const totalPages = 20
  const [date, setDate] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex   flex-col h-full">
          {/* Tabs */}
          <div className="p-4 flex justify-center items-center w-full  border-b">
  <Tabs defaultValue="all">
    <TabsList className="bg-background border">
      <TabsTrigger value="all" className="data-[state=active]:bg-background">
        All Orders
      </TabsTrigger>
      <TabsTrigger value="drafts">Drafts</TabsTrigger>
      <TabsTrigger value="shipping">Shipping</TabsTrigger>
      <TabsTrigger value="completed">Completed</TabsTrigger>
      <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
    </TabsList>
  </Tabs>
</div>


          {/* Search and filters */}
          <div className="p-4 flex items-center justify-between gap-4">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-8 h-9 w-full" />
            </div>
            <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Popover>
      <PopoverTrigger asChild >
        <Button variant="outline" size="sm" className="h-9">
          {date.from && date.to
            ? `${format(date.from, "dd MMM")} - ${format(date.to, "dd MMM")}`
            : "Select Date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto z-10 p-2 bg-white border rounded-md shadow-md">
        <Calendar
          mode="range"
          selected={date}
          // onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
            </div>
            <div className="flex items-center gap-2">
             
              <Button className="bg-[#2DB188] rounded-full hover:bg-[#29a37e] h-9">
                <Download className="mr-2 h-4 w-4" />
                Download as CSV
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30px]"></TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.name}</div>
                        <div className="text-sm text-muted-foreground">{order.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${
                          order.payment === "Paid"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                        }`}
                      >
                        {order.payment}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${
                          order.status === "Shipping"
                            ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                            : "bg-orange-100 text-orange-800 hover:bg-orange-100"
                        }`}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t flex items-center justify-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {[1, 2, 3, 4, 5, 20].map((page, index) => (
              <>
                {index === 5 && <span className="mx-1">...</span>}
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              </>
            ))}
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

