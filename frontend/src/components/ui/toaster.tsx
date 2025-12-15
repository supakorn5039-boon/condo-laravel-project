import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

export function Toaster() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-center justify-between gap-4 rounded-md px-4 py-3 text-sm text-white shadow-lg',
            toast.type === 'success' && 'bg-green-600',
            toast.type === 'error' && 'bg-red-500',
            toast.type === 'info' && 'bg-amber-600'
          )}
        >
          <span>{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="hover:opacity-70">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
