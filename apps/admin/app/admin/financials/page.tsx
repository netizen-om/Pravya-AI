"use client"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

const payments = [
  {
    id: "PAY-001",
    user: "john.doe@company.com",
    amount: 99,
    currency: "USD",
    orderId: "order_123456",
    date: "Dec 5, 2024",
  },
  {
    id: "PAY-002",
    user: "jane.smith@startup.io",
    amount: 49,
    currency: "USD",
    orderId: "order_123457",
    date: "Dec 4, 2024",
  },
  {
    id: "PAY-003",
    user: "alex.johnson@tech.co",
    amount: 199,
    currency: "USD",
    orderId: "order_123458",
    date: "Dec 3, 2024",
  },
  {
    id: "PAY-004",
    user: "maria.garcia@design.com",
    amount: 99,
    currency: "USD",
    orderId: "order_123459",
    date: "Dec 2, 2024",
  },
]

export default function FinancialsPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Financial Log</h1>
        <p className="text-muted-foreground mt-1">Track all payment transactions</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
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
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                    <TableCell className="text-muted-foreground">{payment.user}</TableCell>
                    <TableCell className="font-medium">${payment.amount}</TableCell>
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
                          <DropdownMenuItem>View Metadata</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
