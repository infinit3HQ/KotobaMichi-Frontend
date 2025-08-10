// src/routes/auth/login.tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/card'
import { Button } from '@/components/atoms/button'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Form to be built in Auth task */}
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/">Mock Login</Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              No account? <Link to="/auth/register" className="underline">Register</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
