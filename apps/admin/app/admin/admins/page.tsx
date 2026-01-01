"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAdminSchema, type CreateAdminInput } from "@/lib/validations";

import { createAdminAction, listAdminsAction, deleteAdminAction } from "@/actions/admin-actions";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

enum AdminRoleType {
  SUPER_ADMIN = "SUPER_ADMIN",
  MANAGER = "MANAGER",
  SUPPORT = "SUPPORT",
}

interface Admin {
  id: string;
  name: string;
  email: string;
  role: AdminRoleType;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminsManagementPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTemporary, setIsTemporary] = useState(false);
  const [expirationDate, setExpirationDate] = useState<Date | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateAdminInput>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      role: AdminRoleType.MANAGER,
    },
  });

  const selectedRole = watch("role");

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setIsLoading(true);
    try {
      const result = await listAdminsAction();
      if (result.success && result.admins) {
        setAdmins(result.admins as Admin[]);
      } else {
        toast.error(result.error || "Failed to load admins");
      }
    } catch (error) {
      console.error("Error loading admins:", error);
      toast.error("Failed to load admins");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: CreateAdminInput) => {
    try {
      // If temporary, set expiration to end of day
      let expiresAt: Date | null = null;
      if (isTemporary && expirationDate) {
        expiresAt = new Date(expirationDate);
        expiresAt.setHours(23, 59, 59, 999);
      }

      const submitData = {
        ...data,
        expiresAt,
      };

      const result = await createAdminAction(submitData);

      if (result.success) {
        toast.success("Admin created successfully");
        setIsCreateDialogOpen(false);
        reset();
        setIsTemporary(false);
        setExpirationDate(undefined);
        loadAdmins();
      } else {
        toast.error(result.error || "Failed to create admin");
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      toast.error("Failed to create admin");
    }
  };

  const handleDelete = async (adminId: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) {
      return;
    }

    try {
      const result = await deleteAdminAction(adminId);
      if (result.success) {
        toast.success("Admin deleted successfully");
        loadAdmins();
      } else {
        toast.error(result.error || "Failed to delete admin");
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast.error("Failed to delete admin");
    }
  };

  const getRoleBadgeVariant = (role: AdminRoleType) => {
    switch (role) {
      case AdminRoleType.SUPER_ADMIN:
        return "default";
      case AdminRoleType.MANAGER:
        return "secondary";
      case AdminRoleType.SUPPORT:
        return "outline";
      default:
        return "outline";
    }
  };

  const isExpired = (expiresAt: Date | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Management</h1>
          <p className="text-muted-foreground mt-1">Manage admin accounts and permissions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Create Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="border-0 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Admin</DialogTitle>
              <DialogDescription>Create a new admin account with specified role and permissions.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  {...register("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  {...register("password")}
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={selectedRole}
                  onValueChange={(value) => setValue("role", value as AdminRoleType)}
                >
                  <SelectTrigger id="role" className={`w-full ${errors.role ? "border-destructive" : ""}`}>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AdminRoleType.MANAGER}>Manager</SelectItem>
                    {/* <SelectItem value={AdminRoleType.SUPPORT}>Support</SelectItem> */}
                    <SelectItem value={AdminRoleType.SUPER_ADMIN}>Super Admin</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-destructive">{errors.role.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="temporary"
                  checked={isTemporary}
                  onCheckedChange={(checked) => {
                    setIsTemporary(checked as boolean);
                    if (!checked) {
                      setExpirationDate(undefined);
                    }
                  }}
                />
                <Label htmlFor="temporary" className="cursor-pointer">
                  Create temporary account
                </Label>
              </div>

              {isTemporary && (
                <div className="space-y-2">
                  <Label>Expiration Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !expirationDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {expirationDate ? (
                          format(expirationDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={expirationDate}
                        onSelect={(date) => {
                          if (date) {
                            setExpirationDate(date);
                            setValue("expiresAt", date);
                          }
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    reset();
                    setIsTemporary(false);
                    setExpirationDate(undefined);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Admin</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>All Admins</CardTitle>
          <CardDescription>List of all admin accounts in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : admins.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">No admins found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires At</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(admin.role)}>
                        {admin.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {admin.expiresAt ? (
                        isExpired(admin.expiresAt) ? (
                          <Badge variant="destructive">Expired</Badge>
                        ) : (
                          <Badge variant="outline">Active</Badge>
                        )
                      ) : (
                        <Badge variant="default">Permanent</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {admin.expiresAt
                        ? format(new Date(admin.expiresAt), "PPp")
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      {format(new Date(admin.createdAt), "PPp")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(admin.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

