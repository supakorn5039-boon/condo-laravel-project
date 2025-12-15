import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterDto } from '@/dto'
import { authService } from '@/services'
import { useAuth, useToast } from '@/hooks'
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const { addToast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterDto>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterDto) => {
    try {
      const res = await authService.register(data)
      setAuth(res.user, res.token)
      addToast('Registration successful!', 'success')
      navigate({ to: '/' })
    } catch {
      addToast('Registration failed. Please try again.', 'error')
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">First Name</label>
                <Input
                  placeholder="First name"
                  error={errors.first_name?.message}
                  {...register('first_name')}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Last Name</label>
                <Input
                  placeholder="Last name"
                  error={errors.last_name?.message}
                  {...register('last_name')}
                />
              </div>
            </div>
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
                placeholder="Min 8 characters"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Phone (optional)</label>
              <Input
                placeholder="Phone number"
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Register'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-stone-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-amber-700 hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
