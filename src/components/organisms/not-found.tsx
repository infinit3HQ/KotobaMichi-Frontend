// src/components/not-found.tsx
import { Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader } from '../atoms/card'
import { Button } from '../atoms/button'
import { Separator } from '../atoms/separator'

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-6">
          <h1 className="text-8xl font-bold text-purple-700 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button asChild className="w-full" size="lg">
            <Link to="/">
              Go Home
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>

          <Separator className="my-6" />

          <p className="text-sm text-gray-500 text-center">
            Need help? Contact our support team.
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 