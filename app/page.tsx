'use client'

import dynamic from 'next/dynamic'
import { Spinner } from '@/components/ui/spinner'

// Dynamic import to avoid SSR issues with Three.js
const ArcticFisher = dynamic(
  () => import('@/components/game/arctic-fisher').then((mod) => mod.ArcticFisher),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="w-12 h-12 text-cyan-400" />
          <p className="text-cyan-400 text-lg">Loading Arctic Fisher...</p>
        </div>
      </div>
    ),
  }
)

export default function Home() {
  return <ArcticFisher />
}
