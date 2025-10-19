import React, { Suspense } from "react";
import UserManagmentStats from "@/components/adminPages/userManag/UserManagmentStats";
import UserList from "@/components/adminPages/userManag/UserList";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UserFilters from "@/components/adminPages/userManag/UserFilters";

type User = {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  lastActive: string;
  role: string;
  status: string;
};

// async function fetchUsersPlaceholder(): Promise<User[]> {
//   return [
//     {
//       id: "1",
//       name: "Aisha Kumar",
//       email: "aisha@example.com",
//       joinedDate: "2025-09-28",
//       lastActive: "2025-10-10",
//       role: "student",
//       status: "active",
//     },
//     {
//       id: "2",
//       name: "Rahul Singh",
//       email: "rahul@example.com",
//       joinedDate: "2025-10-01",
//       lastActive: "2025-10-11",
//       role: "teacher",
//       status: "pending",
//     },
//     {
//       id: "3",
//       name: "Meera Patel",
//       email: "meera@example.com",
//       joinedDate: "2025-10-05",
//       lastActive: "2025-10-12",
//       role: "student",
//       status: "inactive",
//     },
//   ];
// }

function StatsFallback() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 animate-pulse"
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="h-7 w-16 rounded-md bg-neutral-300/60 dark:bg-neutral-700/60" />
            <div className="h-3 w-20 rounded-md bg-neutral-200/60 dark:bg-neutral-800/60" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ListFallback() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-6 w-32 bg-neutral-300/60 dark:bg-neutral-700/60 rounded-md" />
      </CardHeader>

      <CardContent>
        {/* Simulate 3–4 user rows */}
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-lg"
            >
              {/* Left side */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-neutral-300/60 dark:bg-neutral-700/60" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-neutral-300/60 dark:bg-neutral-700/60 rounded" />
                  <div className="h-3 w-48 bg-neutral-200/60 dark:bg-neutral-800/60 rounded" />
                  <div className="h-2.5 w-40 bg-neutral-200/60 dark:bg-neutral-800/60 rounded" />
                </div>
              </div>
              {/* Right side */}
              <div className="flex items-center gap-3">
                <div className="space-y-2 text-right">
                  <div className="h-5 w-16 rounded-md bg-neutral-300/60 dark:bg-neutral-700/60" />
                  <div className="h-5 w-16 rounded-md bg-neutral-300/60 dark:bg-neutral-700/60" />
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-md bg-neutral-300/60 dark:bg-neutral-700/60" />
                  <div className="h-8 w-8 rounded-md bg-neutral-300/60 dark:bg-neutral-700/60" />
                  <div className="h-8 w-8 rounded-md bg-neutral-300/60 dark:bg-neutral-700/60" />
                </div>
              </div>
            </div>
          ))}
          {/* Pagination footer */}
          <div className="flex items-center justify-between pt-4">
            <div className="h-3 w-40 bg-neutral-300/60 dark:bg-neutral-700/60 rounded" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-neutral-300/60 dark:bg-neutral-700/60" />
              <div className="h-8 w-8 rounded-md bg-neutral-300/60 dark:bg-neutral-700/60" />
              <div className="h-8 w-8 rounded-md bg-neutral-300/60 dark:bg-neutral-700/60" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function UserManagementPage( ) {


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage all platform users and their access
        </p>
      </div>

      <Suspense fallback={<StatsFallback />}>
        {/* server component: will fetch its own data */}
        <UserManagmentStats />
      </Suspense>


      
      <Suspense fallback={<FiltersFallback />}>
        <UserFilters />
      </Suspense>


      <Suspense fallback={<ListFallback />}>
        {/* server component: fetches based on searchParams */}
        <UserList />
      </Suspense>
    </div>
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