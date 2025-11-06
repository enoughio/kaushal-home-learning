import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Calendar } from "lucide-react";
import ViewDets from "./ViewDets";
import ToggelUserStatus from "./ToggelUserStatus";
import DeleteUser from "./DeleteUser";
import Pagination from "./Pagination";
import myFetch from "@/lib/requestHelper";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  joinedAt: string;
  lastActive: string;
  role: string;
  status: string;
};

type UsersManagement = {
  users: User[];
  page: number;
  totalPages: number;
  totalUsers: number;
};

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

export default async function UserList(
  props: {
    // In the app router the page receives `searchParams` and should pass it
    // down to this server component. It is an object (not a Promise) in most
    // Next.js versions — don't await it here. Make the prop optional so the
    // component can still render when not provided.
    searchParams?: {
      role?: string;
      status?: string;
      search?: string;
      page?: string;
    };
  }
) {

  // Use the provided searchParams object (or an empty object) — do NOT await.
  const searchParams = props.searchParams ?? {};
  const query = searchParams?.search || "" ;
  const page = Number(searchParams.page) || 1;
  const roleFilter = searchParams.role ?? "";
  const statusFilter = searchParams.status ?? "";

  // console.log(searchTerm);

  async function fetchUsers() {
    try {
      // Build URL with search and filter parameters
      const params = new URLSearchParams();
      if (query) params.append("search", query);
      if (roleFilter && roleFilter !== "all") params.append("role", roleFilter);
      if (statusFilter && statusFilter !== "all") params.append("status", statusFilter);
      params.append("page", String(page));
      params.append("limit", "20");

      const url = `/api/admin/users?${params.toString()}`;
      const res = await myFetch(url);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch users");
      }

      if (!result?.data) {
        throw new Error("No data received from server");
      }

      const userData = result.data as UsersManagement;
      const pageSize = 20;
      const users = userData.users as User[];

      // API already handles filtering and pagination
      const totalItems = userData.totalUsers;
      const totalPages = userData.totalPages;
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, totalItems);

      return { users, totalItems, totalPages, startIndex, endIndex, page };
      
    } catch (error) {
      console.error("Error fetching users:", error);
      // Fallback to placeholder data
      return {
        users: [],
        totalItems: 0,
        totalPages: 1,
        startIndex: 0,
        endIndex: 0,
        page: 1,
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
                      <p className="font-medium">
                        {user.firstName + " " + user.lastName}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Joined: {new Date(user.joinedAt).toLocaleDateString()}
                        </div>
                      </div>
           
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
