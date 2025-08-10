// src/routes/auth/register.tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/card'

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
})

function RegisterPage() {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Form to be built in Auth task */}
          <p className="text-sm text-muted-foreground">
            Already have an account? <Link to="/auth/login" className="underline">Login</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
