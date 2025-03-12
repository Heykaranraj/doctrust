"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle2, XCircle, Clock, Search, Filter, MoreHorizontal, Shield } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for demonstration
const pendingDoctors = [
  {
    id: "1",
    name: "Dr. Jane Smith",
    email: "jane.smith@example.com",
    licenseNumber: "MD12345678",
    specialization: "Cardiology",
    submittedDate: "2023-06-15",
    status: "pending",
  },
  {
    id: "2",
    name: "Dr. Michael Johnson",
    email: "michael.johnson@example.com",
    licenseNumber: "MD87654321",
    specialization: "Neurology",
    submittedDate: "2023-06-14",
    status: "pending",
  },
  {
    id: "3",
    name: "Dr. Sarah Williams",
    email: "sarah.williams@example.com",
    licenseNumber: "MD23456789",
    specialization: "Pediatrics",
    submittedDate: "2023-06-13",
    status: "pending",
  },
]

const verifiedDoctors = [
  {
    id: "4",
    name: "Dr. Robert Brown",
    email: "robert.brown@example.com",
    licenseNumber: "MD34567890",
    specialization: "Orthopedics",
    verifiedDate: "2023-06-10",
    status: "verified",
  },
  {
    id: "5",
    name: "Dr. Emily Davis",
    email: "emily.davis@example.com",
    licenseNumber: "MD45678901",
    specialization: "Dermatology",
    verifiedDate: "2023-06-09",
    status: "verified",
  },
]

const reports = [
  {
    id: "1",
    doctorName: "Dr. John Doe",
    licenseNumber: "MD98765432",
    reportType: "Fake Credentials",
    reportDate: "2023-06-12",
    status: "pending",
    priority: "high",
  },
  {
    id: "2",
    doctorName: "Dr. Lisa Anderson",
    licenseNumber: "MD56789012",
    reportType: "Expired License",
    reportDate: "2023-06-11",
    status: "investigating",
    priority: "medium",
  },
  {
    id: "3",
    doctorName: "Dr. Mark Wilson",
    licenseNumber: "MD67890123",
    reportType: "Impersonation",
    reportDate: "2023-06-10",
    status: "resolved",
    priority: "low",
  },
]

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("pending")

  // Filter doctors based on search query
  const filteredPendingDoctors = pendingDoctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredVerifiedDoctors = verifiedDoctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredReports = reports.filter(
    (report) =>
      report.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DocVerify Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage doctor verifications and reports</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 w-full md:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending" className="relative">
              Pending Verifications
              <Badge className="ml-2 bg-amber-500 hover:bg-amber-500">{pendingDoctors.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="verified">Verified Doctors</TabsTrigger>
            <TabsTrigger value="reports" className="relative">
              Reports
              <Badge className="ml-2 bg-red-500 hover:bg-red-500">
                {reports.filter((r) => r.status !== "resolved").length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Doctor Verifications</CardTitle>
                <CardDescription>Review and approve doctor license verification requests</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredPendingDoctors.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>License Number</TableHead>
                        <TableHead>Specialization</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPendingDoctors.map((doctor) => (
                        <TableRow key={doctor.id}>
                          <TableCell className="font-medium">{doctor.name}</TableCell>
                          <TableCell>{doctor.licenseNumber}</TableCell>
                          <TableCell>{doctor.specialization}</TableCell>
                          <TableCell>{doctor.submittedDate}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200"
                            >
                              <Clock className="mr-1 h-3 w-3" />
                              Pending
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" className="h-8 gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Approve
                              </Button>
                              <Button variant="outline" size="sm" className="h-8 gap-1">
                                <XCircle className="h-3.5 w-3.5" />
                                Reject
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem>Request More Info</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No pending verifications found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verified" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Verified Doctors</CardTitle>
                <CardDescription>List of all verified doctors on the blockchain</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredVerifiedDoctors.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>License Number</TableHead>
                        <TableHead>Specialization</TableHead>
                        <TableHead>Verified Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVerifiedDoctors.map((doctor) => (
                        <TableRow key={doctor.id}>
                          <TableCell className="font-medium">{doctor.name}</TableCell>
                          <TableCell>{doctor.licenseNumber}</TableCell>
                          <TableCell>{doctor.specialization}</TableCell>
                          <TableCell>{doctor.verifiedDate}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                            >
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Verified
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" className="h-8">
                                View QR Code
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem>Revoke License</DropdownMenuItem>
                                  <DropdownMenuItem>Update Information</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No verified doctors found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reported Doctors</CardTitle>
                <CardDescription>Review and investigate reports of suspicious activity</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredReports.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Doctor Name</TableHead>
                        <TableHead>License Number</TableHead>
                        <TableHead>Report Type</TableHead>
                        <TableHead>Report Date</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.doctorName}</TableCell>
                          <TableCell>{report.licenseNumber}</TableCell>
                          <TableCell>{report.reportType}</TableCell>
                          <TableCell>{report.reportDate}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                report.priority === "high"
                                  ? "bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
                                  : report.priority === "medium"
                                    ? "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200"
                                    : "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200"
                              }
                            >
                              {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                report.status === "pending"
                                  ? "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200"
                                  : report.status === "investigating"
                                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200"
                                    : "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                              }
                            >
                              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" className="h-8">
                                Investigate
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                                  <DropdownMenuItem>Escalate</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No reports found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

