import { ReactNode } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Button } from './ui/button'

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Personal Intellectual Mirror</h1>
          <Button variant="ghost" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
