"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AdminDataService, type UserManagement } from "@/lib/adminData"
import { Search, Users, UserX, Trash2, Eye, Calendar, Mail } from "lucide-react"

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserManagement[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserManagement[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await AdminDataService.getAllUsers()
        setUsers(data)
        setFilteredUsers(data)
      } catch (error) {
        console.error("Failed to load users:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  useEffect(() => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter)
    }

    setFilteredUsers(filtered)
  }, [searchTerm, roleFilter, statusFilter, users])
  

  const handleStatusUpdate = async (userId: string, newStatus: "active" | "inactive") => {
    setUpdating(userId)
    try {
      await AdminDataService.updateUserStatus(userId, newStatus)
      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))
    } catch (error) {
      console.error("Failed to update user status:", error)
    } finally {
      setUpdating(null)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    setUpdating(userId)
    try {
      await AdminDataService.deleteUser(userId)
      setUsers((prev) => prev.filter((user) => user.id !== userId))
    } catch (error) {
      console.error("Failed to delete user:", error)
    } finally {
      setUpdating(null)
    }
  }

  const getStatusColor = (status: UserManagement["status"]) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "pending":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getRoleColor = (role: UserManagement["role"]) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "teacher":
        return "default"
      case "student":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.status === "active").length
  const pendingUsers = users.filter((u) => u.status === "pending").length
  const students = users.filter((u) => u.role === "student").length
  const teachers = users.filter((u) => u.role === "teacher").length

  if (loading) {
    return (
      <AdminLayout activeTab="users">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout activeTab="users">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage all platform users and their access</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-chart-1">{totalUsers}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-chart-2">{activeUsers}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-destructive">{pendingUsers}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-chart-3">{students}</p>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-chart-4">{teachers}</p>
                <p className="text-sm text-muted-foreground">Teachers</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="bg-input">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="student">Students</SelectItem>
              <SelectItem value="teacher">Teachers</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-input">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                    ? "No users found matching your criteria"
                    : "No users found"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background">
                        <Users className="h-6 w-6 text-chart-1" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Joined: {user.joinedDate}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">Last active: {user.lastActive}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge variant={getRoleColor(user.role)} className="mb-1">
                          {user.role}
                        </Badge>
                        <br />
                        <Badge variant={getStatusColor(user.status)}>{user.status}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {user.role !== "admin" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleStatusUpdate(user.id, user.status === "active" ? "inactive" : "active")
                              }
                              disabled={updating === user.id}
                              className="bg-transparent"
                            >
                              {user.status === "active" ? <UserX className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="bg-transparent text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {user.name}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="bg-destructive text-destructive-foreground"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
