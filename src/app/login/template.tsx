'use client'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      {children}
    </div>
  )
}
