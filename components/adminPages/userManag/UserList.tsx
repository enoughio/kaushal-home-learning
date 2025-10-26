import React, { Suspense } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Calendar } from "lucide-react";
import ViewDets from "./ViewDets";
import ToggelUserStatus from "./ToggelUserStatus";
import DeleteUser from "./DeleteUser";
import Pagination from "./Pagination";
import UserFilters from "./UserFilters";
import { cookies } from 'next/headers'

type User = {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  lastActive: string;
  role: string;
  status: string;
};

// type Props = { users: User[]; totalItems: number; page: number; pageSize: number; totalPages: number; startIndex: number; endIndex: number }

function getStatusColor(status: string) {
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
}

function getRoleColor(role: string) {
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
}


export default async function UserList({
  searchParams,
}: {
  searchParams?: Promise<{ page ?: string; pageSize ?: string; search ?: string; role ?: string; status ?: string  }>;
}) {
  const params = await searchParams ?? {};
  const page = Number(params?.page ?? 1);
  const pageSize = Number(params?.pageSize ?? 10);
  const searchTerm = (params?.search ?? "").toString();
  const roleFilter = (params?.role ?? "all").toString();
  const statusFilter = (params?.status ?? "all").toString();

  async function fetchUsers() {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("auth-token");
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const url = new URL(`${baseUrl}/api/admin/users-managment`);
      url.searchParams.set('page', page.toString());
      url.searchParams.set('limit', pageSize.toString());
      if (searchTerm) url.searchParams.set('search', searchTerm);
      if (roleFilter !== 'all') url.searchParams.set('role', roleFilter);
      if (statusFilter !== 'all') url.searchParams.set('status', statusFilter);

      const response = await fetch(url.toString(), {
        headers: {
          "authorization": `Bearer ${token?.value}` || "",
        },
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message);
      }
      const result = await response.json();
      const { users, pagination } = result.data;

      const mappedUsers: User[] = users.map((user: any) => ({
        id: user.id.toString(),
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown',
        email: user.email,
        joinedDate: new Date(user.createdAt).toLocaleDateString(),
        lastActive: new Date(user.createdAt).toLocaleDateString(), // Using createdAt as placeholder
        role: user.role,
        status: user.isActive ? 'active' : 'inactive',
      }));

      return {
        users: mappedUsers,
        totalItems: pagination.total,
        totalPages: pagination.totalPages,
        startIndex: (page - 1) * pageSize,
        endIndex: Math.min(page * pageSize, pagination.total),
        page
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      // Fallback to empty data
      return {
        users: [],
        totalItems: 0,
        totalPages: 1,
        startIndex: 0,
        endIndex: 0,
        page: 1
      };
    }
  }

  const {
    users,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    page: currentPage,
  } = await fetchUsers();

  return (
    <>


      <Card>
        <CardHeader>
          <CardTitle>Users ({totalItems})</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
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
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Joined: {user.joinedDate}
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
                      <ViewDets userId={user.id} />
                      {user.role !== "admin" && (
                        <>
                          <ToggelUserStatus
                            userId={user.id}
                            currentStatus={user.status}
                          />
                          <DeleteUser userId={user.id} />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {totalItems === 0 ? 0 : startIndex + 1}-{endIndex} of{" "}
                  {totalItems}
                </div>
                <div className="flex items-center gap-3">
                  <Pagination page={currentPage} totalPages={totalPages} />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}




function FiltersFallback() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 rounded bg-neutral-300/60 dark:bg-neutral-700/60" />
        <div className="h-10 w-full rounded-md bg-neutral-200/60 dark:bg-neutral-800/60" />
      </div>
      {/* Role Select */}
      <div className="h-10 w-full rounded-md bg-neutral-200/60 dark:bg-neutral-800/60" />
      {/* Status Select */}
      <div className="h-10 w-full rounded-md bg-neutral-200/60 dark:bg-neutral-800/60" />
      {/* Apply Button */}
      <div className="md:col-span-3 flex justify-end">
        <div className="h-9 w-20 rounded-md bg-neutral-300/60 dark:bg-neutral-700/60" />
      </div>
    </div>
  );
}