"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, MoreHorizontal, Trash2 } from "lucide-react"

const users = [
  {
    id: 1,
    email: "john.doe@company.com",
    name: "John Doe",
    subscription: "Subscribed",
    interviews: 12,
    resumes: 3,
    joined: "Dec 1, 2024",
  },
  {
    id: 2,
    email: "jane.smith@startup.io",
    name: "Jane Smith",
    subscription: "Not Subscribed",
    interviews: 0,
    resumes: 1,
    joined: "Nov 15, 2024",
  },
  {
    id: 3,
    email: "alex.johnson@tech.co",
    name: "Alex Johnson",
    subscription: "Subscribed",
    interviews: 28,
    resumes: 5,
    joined: "Oct 1, 2024",
  },
  {
    id: 4,
    email: "maria.garcia@design.com",
    name: "Maria Garcia",
    subscription: "Subscribed",
    interviews: 8,
    resumes: 2,
    joined: "Nov 1, 2024",
  },
]

export default function UserManagementPage() {
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", subscription: false })
  const [open, setOpen] = useState(false)

  const handleCreateUser = () => {
    console.log("Creating user:", newUser)
    setNewUser({ name: "", email: "", password: "", subscription: false })
    setOpen(false)
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage all platform users</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Create New User
            </Button>
          </DialogTrigger>
          <DialogContent className="border-0">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>Add a new user to the Pravya AI platform</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="subscription"
                  checked={newUser.subscription}
                  onCheckedChange={(checked) => setNewUser({ ...newUser, subscription: checked as boolean })}
                />
                <Label htmlFor="subscription" className="font-normal cursor-pointer">
                  Grant Subscription?
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateUser} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Save User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Interviews</TableHead>
                  <TableHead>Resumes</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.subscription === "Subscribed" ? "default" : "secondary"}
                        className={user.subscription === "Subscribed" ? "bg-primary" : ""}
                      >
                        {user.subscription}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.interviews}</TableCell>
                    <TableCell>{user.resumes}</TableCell>
                    <TableCell className="text-muted-foreground">{user.joined}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-0">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit User</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
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
