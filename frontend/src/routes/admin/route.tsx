import { createFileRoute, Outlet, Link, useNavigate } from '@tanstack/react-router'
import { useAuth, useToast } from '@/hooks'
import { useEffect } from 'react'
import { LayoutDashboard, Home as HomeIcon, LogOut } from 'lucide-react'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  const { user, isAdmin, clearAuth } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || !isAdmin()) {
      addToast('Access denied', 'error')
      navigate({ to: '/' })
    }
  }, [user, isAdmin, addToast, navigate])

  if (!user || !isAdmin()) {
    return null
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-64 border-r border-stone-200 bg-white p-4">
        <nav className="space-y-1">
          <Link
            to="/admin"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-stone-600 hover:bg-stone-100 [&.active]:bg-amber-100 [&.active]:text-amber-700"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            to="/admin/rooms"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-stone-600 hover:bg-stone-100 [&.active]:bg-amber-100 [&.active]:text-amber-700"
          >
            <HomeIcon className="h-4 w-4" />
            Rooms
          </Link>
          <button
            onClick={clearAuth}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-stone-600 hover:bg-stone-100"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </nav>
      </aside>
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  )
}
