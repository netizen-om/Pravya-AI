"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MoreHorizontal } from "lucide-react"
import { getPayments } from "@/actions/financial-actions"
import { toast } from "sonner"

// Shadcn Pagination
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination"

interface Payment {
  id: string
  user: string
  amount: number
  currency: string
  orderId: string
  date: string
  metadata: any
}

export default function FinancialsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [metadataOpen, setMetadataOpen] = useState(false)

  // Pagination states
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const totalPages = Math.ceil(payments.length / pageSize)

  useEffect(() => {
    loadPayments()
  }, [])

  async function loadPayments() {
    try {
      setLoading(true)
      const result = await getPayments()
      if (result.success && result.payments) {
        setPayments(result.payments)
      } else {
        toast.error(result.error || "Failed to load payments")
      }
    } catch (error) {
      console.error("Error loading payments:", error)
      toast.error("Failed to load payments")
    } finally {
      setLoading(false)
    }
  }

  const formatAmount = (amount: number, currency: string) => {
    if (currency === "INR") {
      return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
    return `${currency} ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // Pagination slice
  const paginatedData = payments.slice((page - 1) * pageSize, page * pageSize)

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <h1 className="text-3xl font-bold">Financial Log</h1>
        <p className="text-muted-foreground mt-1">Loading...</p>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Financial Log</h1>
        <p className="text-muted-foreground mt-1">Track all payment transactions</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">

            {/* PAGE SIZE SELECTOR */}
            <div className="flex justify-end mb-3">
              <select
                className="border rounded px-2 py-1 bg-background"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setPage(1)
                }}
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={30}>30 per page</option>
              </select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                      <TableCell className="text-muted-foreground">{payment.user}</TableCell>
                      <TableCell className="font-medium">{formatAmount(payment.amount, payment.currency)}</TableCell>
                      <TableCell>{payment.currency}</TableCell>
                      <TableCell className="font-mono text-sm">{payment.orderId}</TableCell>
                      <TableCell className="text-muted-foreground">{payment.date}</TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="border-0">
                            {payment.metadata && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedPayment(payment)
                                  setMetadataOpen(true)
                                }}
                              >
                                View Metadata
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No payments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent>

                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => page > 1 && setPage(page - 1)}
                        className={page === 1 ? "opacity-50 pointer-events-none" : ""}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <PaginationItem key={idx}>
                        <PaginationLink
                          isActive={page === idx + 1}
                          onClick={() => setPage(idx + 1)}
                        >
                          {idx + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => page < totalPages && setPage(page + 1)}
                        className={page === totalPages ? "opacity-50 pointer-events-none" : ""}
                      />
                    </PaginationItem>

                  </PaginationContent>
                </Pagination>
              </div>
            )}

          </CardContent>
        </Card>
      </motion.div>

      {/* METADATA DIALOG */}
      <Dialog open={metadataOpen} onOpenChange={setMetadataOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Metadata</DialogTitle>
            <DialogDescription>Payment ID: {selectedPayment?.id}</DialogDescription>
          </DialogHeader>

          {selectedPayment?.metadata && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Metadata</p>
                <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-96">
                  {JSON.stringify(selectedPayment.metadata, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
