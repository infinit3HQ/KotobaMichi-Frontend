// src/routes/auth/login.tsx
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/card'
import { Button } from '@/components/atoms/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/atoms/form'
import { Input } from '@/components/atoms/input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api, getApiError } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })
  type FormVals = z.infer<typeof schema>
  const form = useForm<FormVals>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } })

  const onSubmit = async (values: FormVals) => {
    try {
      const res = await api.post('/auth/login', values)
      const { access_token, user } = res.data as { access_token: string; user: { id: string; email: string; role: 'USER' | 'ADMIN' } }
      login({ token: access_token, user })
      toast.success('Logged in')
      router.navigate({ to: '/' })
    } catch (e) {
      const { message } = getApiError(e)
      toast.error(message ?? 'Login failed')
    }
  }

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
          </Form>
          <p className="mt-3 text-sm text-muted-foreground">
            No account? <Link to="/auth/register" className="underline">Register</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
