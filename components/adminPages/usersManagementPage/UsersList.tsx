"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, UserX, Eye, Trash2, Mail, Calendar } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { type UserManagement } from "@/lib/adminData";

interface UsersListProps {
  users: UserManagement[];
  loading: boolean;
  updating: string | null;
  handleStatusUpdate: (userId: string, status: "active" | "inactive") => void;
  handleDeleteUser: (userId: string) => void;
}

function UsersList({
  users,
  loading,
  updating,
  handleStatusUpdate,
  handleDeleteUser,
}: UsersListProps) {
  const getStatusColor = (status: UserManagement["status"]) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "pending":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getRoleColor = (role: UserManagement["role"]) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "teacher":
        return "default";
      case "student":
        return "secondary";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-gray-100 rounded-lg animate-pulse"
            >
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-300"></div>
                <div className="space-y-2">
                  {/* Name */}
                  <div className="h-4 w-32 bg-gray-300 rounded"></div>
                  {/* Email and Joined */}
                  <div className="h-3 w-48 bg-gray-200 rounded"></div>
                  <div className="h-3 w-36 bg-gray-200 rounded"></div>
                  {/* Last active */}
                  <div className="h-3 w-24 bg-gray-200 rounded mt-1"></div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Role & Status badges */}
                <div className="space-y-1 text-right">
                  <div className="h-4 w-16 bg-gray-300 rounded mx-auto"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded mx-auto"></div>
                </div>
                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-gray-300 rounded"></div>
                  <div className="h-6 w-6 bg-gray-300 rounded"></div>
                  <div className="h-6 w-6 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users ({users.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No users found
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 bg-muted rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background">
                  <Users className="h-6 w-6 text-chart-1" />
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" /> {user.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> Joined: {user.joinedDate}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last active: {user.lastActive}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <Badge variant={getRoleColor(user.role)} className="mb-1">
                    {user.role}
                  </Badge>
                  <br />
                  <Badge variant={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {user.role !== "admin" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={updating === user.id}
                        onClick={() =>
                          handleStatusUpdate(
                            user.id,
                            user.status === "active" ? "inactive" : "active"
                          )
                        }
                        className="bg-transparent"
                      >
                        {user.status === "active" ? (
                          <UserX className="h-4 w-4" />
                        ) : (
                          <Users className="h-4 w-4" />
                        )}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {user.name}? This
                              action cannot be undone.
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
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default UsersList;
