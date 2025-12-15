import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginDto } from '@/dto'
import { authService } from '@/services'
import { useAuth, useToast } from '@/hooks'
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const { addToast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginDto) => {
    try {
      const res = await authService.login(data)
      setAuth(res.user, res.token)
      addToast('Login successful!', 'success')
      navigate({ to: '/' })
    } catch {
      addToast('Invalid credentials', 'error')
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-stone-600">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-amber-700 hover:underline">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
