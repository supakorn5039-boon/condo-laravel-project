import { Outlet, createRootRoute, Link } from '@tanstack/react-router'
import { Toaster } from '@/components/ui'
import { useAuth } from '@/hooks'
import { Building2, User, LogOut } from 'lucide-react'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const { user, clearAuth, isAdmin } = useAuth()

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold text-amber-700">
            <Building2 className="h-6 w-6" />
            <span>CondoHub</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm text-stone-600 hover:text-amber-700 [&.active]:font-medium [&.active]:text-amber-700"
            >
              Rooms
            </Link>
            {user ? (
              <>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="text-sm text-stone-600 hover:text-amber-700 [&.active]:font-medium [&.active]:text-amber-700"
                  >
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-3 border-l border-stone-200 pl-4">
                  <span className="flex items-center gap-1.5 text-sm text-stone-600">
                    <User className="h-4 w-4" />
                    {user.first_name}
                  </span>
                  <button
                    onClick={clearAuth}
                    className="text-stone-400 hover:text-amber-700"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-stone-600 hover:text-amber-700 [&.active]:font-medium [&.active]:text-amber-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-amber-600 px-4 py-2 text-sm text-white hover:bg-amber-700"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <Toaster />
    </div>
  )
}
