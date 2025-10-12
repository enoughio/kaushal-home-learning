"use client"

import { useState, useEffect } from "react"
import { AdminDataService, type PaymentDue } from "@/lib/adminData"
import PaymentStats from "./PaymentStats"
import PaymentFilters from "./PaymentFilters"
import PaymentsList from "./PaymentsList"

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentDue[]>([])
  const [filteredPayments, setFilteredPayments] = useState<PaymentDue[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Load payments
  useEffect(() => {
    const loadPayments = async () => {
      try {
        const data = await AdminDataService.getPaymentDues()
        setPayments(data)
        setFilteredPayments(data)
      } catch (error) {
        console.error("Failed to load payments:", error)
      } finally {
        setLoading(false)
      }
    }
    loadPayments()
  }, [])

  // Filter payments
  useEffect(() => {
    let filtered = payments

    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.subject.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((payment) => payment.status === statusFilter)
    }

    setFilteredPayments(filtered)
  }, [searchTerm, statusFilter, payments])

  return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Payment Overview</h1>
          <p className="text-muted-foreground">Monitor payment status and dues across the platform</p>
        </div>

        {/* Payment Stats */}
        <PaymentStats payments={payments} loading={loading} />

        {/* Filters */}
        <PaymentFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Payments List */}
        <PaymentsList
          payments={filteredPayments}
          loading={loading}
        />
      </div>
  )
}