// src/routes/dashboard/dashboard.tsx
import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '@/components/organisms/protected-route'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <ProtectedRoute adminOnly>
      <div>
        <h2 className="text-xl font-semibold mb-2">Admin Dashboard</h2>
        <p className="text-muted-foreground">Manage vocabulary and quizzes.</p>
      </div>
    </ProtectedRoute>
  )
}
