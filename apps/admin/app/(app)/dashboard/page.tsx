import { Card } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Welcome to your recruitment management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Active Interviews</p>
          <p className="text-3xl font-bold text-primary">12</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Pending Reviews</p>
          <p className="text-3xl font-bold text-accent">8</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Resumes</p>
          <p className="text-3xl font-bold text-foreground">245</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Hired This Month</p>
          <p className="text-3xl font-bold text-green-500">5</p>
        </Card>
      </div>
    </div>
  )
}
