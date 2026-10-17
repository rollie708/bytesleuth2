'use client'

import { useState, useEffect } from 'react'
import { X as CloseIcon, Menu as OpenIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export function Header() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleMenuClick = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleNavigate = (path: string) => {
    setOpen(false)
    router.push(path)
  }

  return (
    <header className="flex items-center justify-between px-4 py-4 border-b bg-black/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16l-4-4 4-4m0 0l4 4-4 4m0-8l4 4-4 4" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-primary">ByteSleuth</h1>
      </div>

      <button
        onClick={handleMenuClick}
        className="md:hidden rounded-md bg-secondary px-3 py-2 text-sm text-primary"
        aria-label="Open menu"
      >
        {open ? <CloseIcon className="h-4 w-4" /> : <OpenIcon className="h-4 w-4" />}
      </button>
    </header>
  )
}