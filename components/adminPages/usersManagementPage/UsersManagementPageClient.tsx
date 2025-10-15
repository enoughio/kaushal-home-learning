"use client";

import { useState, useEffect } from "react";
import { AdminDataService, type UserManagement } from "@/lib/adminData";
import Stats from "./Stats";
import Filters from "./Filters";
import UsersList from "./UsersList";

export default function UserManagementPageClient() {
  const [users, setUsers] = useState<UserManagement[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserManagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<string | null>(null);

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await AdminDataService.getAllUsers();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  // Apply filters & search
  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, statusFilter, users]);

  const handleStatusUpdate = async (
    userId: string,
    newStatus: "active" | "inactive"
  ) => {
    setUpdating(userId);
    try {
      await AdminDataService.updateUserStatus(userId, newStatus);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      console.error("Failed to update user status:", error);
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setUpdating(userId);
    try {
      await AdminDataService.deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage all platform users and their access
        </p>
      </div>

      <Stats loading={true} />

      <Filters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <UsersList
        users={filteredUsers}
        loading={loading}
        updating={updating}
        handleStatusUpdate={handleStatusUpdate}
        handleDeleteUser={handleDeleteUser}
      />
    </div>
  );
}
